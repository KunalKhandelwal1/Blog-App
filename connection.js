import mongoose from "mongoose";

async function connection(url) {
  return mongoose
    .connect(url)
    .then(() => {
      console.log("DB is connected succesfully");
    })
    .catch((err) => {
      console.log("err : ", err);
    });
}
export {connection};
