require('@openzeppelin/test-helpers');

const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');

const { expect } = require('chai');
const { BN, expectRevert, constants } = require('@openzeppelin/test-helpers');
const { ZERO_ADDRESS } = constants;
const { advanceBlockAndSetTime, advanceTimeAndBlock } = require('./helpers/standingTheTime');

const YayGiver = artifacts.require('YayGiver');
const YayGiftNFT = artifacts.require('YayGiftNFT');

contract('YayGiver', function (accounts) {

    async function claimInAllCases(rewardAfterTge, stepReward, deltaTime, accountPos) {
    
        it('before TGE', async function () {
            await advanceBlockAndSetTime(this.tgeTimestamp - 1*DAY);
    
            const proof = this.merkleTree.getHexProof(this.elems[accountPos]);
            await expectRevert(
                this.yayGiver.claim(this.balances[accountPos][1], this.balances[accountPos][2], proof, {from: accounts[accountPos]}),
                'yayGiver: TGE has not started yet',
            );
            
        });
    
        for (let i = 0; i < (STEP_COUNT + 1); i++) {
            // console.log("");
            for (let j = 0; j < 2**i; j++) {
                let a = [];
                for (let k = 0; k < i; k++) {
                    if ((j >> k) & 1) {
                        a.push(k);
                    }
                }
                a.push(i)
                // console.log(a);
                
                let testMsg = i == 0 ? 'after tge' : `step ${i}, variant ${a}`
                it(testMsg, async function () {
                    const proof = this.merkleTree.getHexProof(this.elems[accountPos]);

                    let totalClaimed = new BN("0");
                    let afterTgeValue = this.balances[accountPos][2].mul(rewardAfterTge).div(new BN("10000"));
                    for (const elem of a) {
                        await advanceBlockAndSetTime(this.tgeTimestamp + deltaTime * elem + 1*DAY);
                        let result = (await this.yayGiver.claim.call(this.balances[accountPos][1], this.balances[accountPos][2], proof, {from: accounts[accountPos]}));
                        let expectedReward;

                        
                        if (elem == 0) {
                            expectedReward = afterTgeValue;
                        } else {
                            expectedReward = this.balances[accountPos][2].mul(stepReward).div(new BN("10000")).mul(new BN(elem)).add(afterTgeValue).sub(totalClaimed);
                        }

                        await assert.equal(
                            result.toString(),
                            expectedReward.toString()
                        );

                        totalClaimed = totalClaimed.add(result);

                        await this.yayGiver.claim(this.balances[accountPos][1], this.balances[accountPos][2], proof, {from: accounts[accountPos]});
                        expect((await this.token.balanceOf.call(accounts[accountPos])).toString()).to.equal(totalClaimed.toString());

                        await expectRevert(
                            this.yayGiver.claim(this.balances[accountPos][1], this.balances[accountPos][2], proof, {from: accounts[accountPos]}),
                            'yayGiver: no tokens to claim',
                        );
                    }
                });  
            }
        }
    }

    before(function() {
        this.users = [
            accounts[0],
            accounts[1],
            accounts[2],
            accounts[3],
        ];
        
        this.elems = [];
        this.users.forEach(element => {
            let hash = web3.utils.soliditySha3(element);
            this.elems.push(hash);
        });

        this.merkleTree = new MerkleTree(this.elems, keccak256, { hashLeaves: false, sortPairs: true });

        this.merkleRoot = this.merkleTree.getHexRoot();
    });

    it('negative constructor', async function () {

        this.startTimestamp = (await web3.eth.getBlock('latest')).timestamp + 5;
        this.yayGiver = await YayGiver.new(
            this.merkleRoot,
            this.startTimestamp
        );

        await expectRevert(
            YayGiver.new(
                "0x0000000000000000000000000000000000000000000000000000000000000000",
                this.startTimestamp
            ),
            "YayGiver: zero mercle root",
        );
        await expectRevert(
            YayGiver.new(
                this.merkleRoot,
                "0"
            ),
            "YayGiver: wrong start timestamp",
        );
    });

    describe('functions', function () {
        beforeEach(async function () {
            this.startTimestamp = (await web3.eth.getBlock('latest')).timestamp + 5;
            this.yayGiver = await YayGiver.new(this.merkleRoot, this.startTimestamp);
            this.nftToken = await YayGiftNFT.at(await this.yayGiver.token());
        });

        describe('verify', function () {
            it('positive proof', async function () {
                const proof1 = this.merkleTree.getHexProof(this.elems[0]);
                const result1 = await this.yayGiver.checkVerify(this.users[0], proof1);
                expect(result1).to.equal(true);
    
                const proof2 = this.merkleTree.getHexProof(this.elems[1]);
                const result2 = await this.yayGiver.checkVerify(this.users[1], proof2);
                expect(result2).to.equal(true);
    
                const proof3 = this.merkleTree.getHexProof(this.elems[2]);
                const result3 = await this.yayGiver.checkVerify(this.users[2], proof3);
                expect(result3).to.equal(true);
    
                const proof4 = this.merkleTree.getHexProof(this.elems[3]);
                const result4 = await this.yayGiver.checkVerify(this.users[3], proof4);
                expect(result4).to.equal(true);
            });
            it('negative proof', async function () {
                const proof1 = this.merkleTree.getHexProof(this.elems[0]);
                const result1 = await this.yayGiver.checkVerify(this.users[1], proof1)
                expect(result1).to.equal(false);
    
                const proof2 = this.merkleTree.getHexProof(this.elems[1]);
                const result2 = await this.yayGiver.checkVerify(this.users[2], proof2)
                expect(result2).to.equal(false);
            });
        });
    
        describe('claim', function () {
            it('negative cases', async function () {
                const proof1 = this.merkleTree.getHexProof(this.elems[0]);
                await expectRevert(
                    this.yayGiver.claim(proof1, {from: accounts[1]}),
                    'YayGiver: invalid proof or wrong data',
                );
                await expectRevert(
                    this.yayGiver.claim(proof1, {from: accounts[0]}),
                    'YayGiver: giver has not started yet',
                );

                await advanceBlockAndSetTime(this.startTimestamp + 5);

                const proof2 = this.merkleTree.getHexProof(this.elems[1]);
                await this.yayGiver.claim(proof2, {from: accounts[1]});
                await expectRevert(
                    this.yayGiver.claim(proof2, {from: accounts[1]}),
                    'YayGiver: already received the gift',
                );

                await advanceBlockAndSetTime(this.startTimestamp + 50000);
                await expectRevert(
                    this.yayGiver.claim(proof2, {from: accounts[1]}),
                    'YayGiver: already received the gift',
                );
            });
            it('positive', async function () {
                // first user
                const proof = this.merkleTree.getHexProof(this.elems[0]);
                await advanceBlockAndSetTime(this.startTimestamp + 5);
        
                let result = (await this.yayGiver.claim.call(proof, {from: accounts[0]})).toString();
                await assert.equal(
                    result,
                    0
                );
                await this.yayGiver.claim(proof, {from: accounts[0]});
                expect((await this.nftToken.balanceOf.call(accounts[0])).toString()).to.equal("1");
        
                await expectRevert(
                    this.yayGiver.claim(proof, {from: accounts[0]}),
                    'YayGiver: already received the gift',
                );

            });
        });

    });

});