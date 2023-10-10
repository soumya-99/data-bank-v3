import dbConnection from "../Connection"

export const createLoginTable = () => {
    const db = dbConnection()

    db.transaction(tx => {
        tx.executeSql(
            "CREATE TABLE IF NOT EXISTS "
            + "Login "
            + "(AgentCode TEXT, AgentName TEXT, Bank TEXT, Branch TEXT, Date TEXT, Time TEXT, TotalCollection INTEGER);"
        )
        console.log("<====== Login Table Created ======>")
    })
}
