import data from "@/lib/data";
import { connectToDatabase } from ".";
import Product from "./models/product.models";
import { cwd } from "process";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(cwd());

const main = async () => {
  try {
    const { products } = data;
    await connectToDatabase(process.env.MONGODB_URL);

    await Product.deleteMany();
    const createdProuducts = await Product.insertMany(products);
    console.log({
      createdProuducts,
      meassage: "seeded databse successfully",
    });
    process.exit(0);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to seed database");
  }
};

main();
