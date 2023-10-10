import SQLite from "react-native-sqlite-storage"

export default function dbConnection() {
  return SQLite.openDatabase(
    {
      name: "DataBankV3.db",
      location: "default",
    },
    () => { },
    err => {
      console.log("DB Error XX===XX", err)
    },
  )
}
