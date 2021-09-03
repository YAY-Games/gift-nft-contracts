const YayGiver = artifacts.require("YayGiver");

async function main() {
  const yayGiver = await YayGiver.new(
    process.env["MERCLE_ROOT"],
    process.env["START_TIMESTAMP"],
  );
  await YayGiver.setAsDeployed(yayGiver);

  console.log("contract deployed: ", yayGiver.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });