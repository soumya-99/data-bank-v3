import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Modal,
  Pressable,
  ToastAndroid,
} from "react-native"
import { useContext, useEffect, useState } from "react"
import { COLORS, colors } from "../../Resources/colors"
import CustomHeader from "../../Components/CustomHeader"
import {
  Table,
  TableWrapper,
  Row,
  Rows,
  Col,
} from "react-native-table-component"
import { BluetoothEscposPrinter } from "react-native-bluetooth-escpos-printer"
import InputComponent from "../../Components/InputComponent"
import ButtonComponent from "../../Components/ButtonComponent"
import axios from "axios"
import { AppStore } from "../../Context/AppContext"
import { REACT_APP_BASE_URL } from "../../Config/config"
import mainNavigationRoutes from "../../Routes/NavigationRoutes"
import { StackActions } from "@react-navigation/native"
import { address } from "../../Routes/addresses"
import { logo } from "../../Resources/ImageStrings/logo"
import { gle } from "../../Resources/ImageStrings/gle"
import { glej } from "../../Resources/ImageStrings/glej"
import { Alert } from "react-native"
// import logoCut from "../../Resources/Images/logo_cut.png"

const AccountPreview = ({ navigation, route }) => {
  const [receiptNumber, setReceiptNumber] = useState(() => "")
  const [isSaveEnabled, setIsSaveEnabled] = useState(() => false)

  const {
    id,
    userId,
    maximumAmount,
    getTotalDepositAmount,
    totalDepositedAmount,
    todayDateFromServer,
    agentName,
    bankName,
    branchName,
    totalCollection,
    login,
  } = useContext(AppStore)
  const { item, money } = route.params

  // const [addedMoney, setAddedMoney] = useState(() => 0)

  const tableData = [
    [
      "A/c Type",
      item?.acc_type == "D"
        ? "Daily"
        : item?.acc_type == "R"
        ? "RD"
        : item?.acc_type == "L"
        ? "Loan"
        : "",
    ],
    ["A/c No.", item?.account_number],
    ["Name", item?.customer_name],
    ["Mobile No.", item?.mobile_no],
    ["Opening Date", new Date(item?.opening_date).toLocaleDateString("en-GB")],
    ["Previous Balance", item?.current_balance],
  ]

  const netTotalSectionTableData = [
    ["Tnx. Date", new Date(todayDateFromServer).toLocaleDateString("en-GB")],
    ["Deposit Amt.", money],
    ["Current Balance", item?.current_balance + parseFloat(money)],
  ]

  const resetAction = StackActions.popToTop()

  const sendCollectedMoney = async () => {
    const obj = {
      bank_id: item?.bank_id,
      branch_code: item?.branch_code,
      agent_code: userId,
      account_holder_name: item?.customer_name,
      transaction_date: new Date().toISOString(),
      account_type: item?.acc_type,
      product_code: item?.product_code,
      account_number: item?.account_number,
      total_amount: item?.current_balance + parseFloat(money),
      deposit_amount: parseFloat(money),
      collection_by: id,
    }
    console.log("===========", obj)
    await axios
      .post(address.TRANSACTION, obj, {
        headers: {
          Accept: "application/json",
        },
      })
      .then(res => {
        console.log("###### Preview: ", res.data)
        // alert(`Receipt No is ${res.data.receipt_no}`)
        Alert.alert("Receipt No.", `Receipt No is ${res.data.receipt_no}`, [
          {
            text: "Okay",
            onPress: () => console.log("Receipt generated."),
          }
        ])
        setReceiptNumber(res.data.receipt_no)
        setIsSaveEnabled(false)
        printReceipt(res.data.receipt_no)
        navigation.dispatch(resetAction)
      })
      .catch(err => {
        console.log(err.response.data)
        alert("Data already submitted. Please upload new dataset.")
        ToastAndroid.showWithGravityAndOffset(
          "Data already submitted. Please upload new dataset.",
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
          25,
          50,
        )
      })
  }

  async function printReceipt(rcptNo) {
    try {
      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.CENTER,
      )
      await BluetoothEscposPrinter.printText(bankName, { align: "center" })
      await BluetoothEscposPrinter.printText("\r\n", {})
      await BluetoothEscposPrinter.printText(branchName, { align: "center" })
      await BluetoothEscposPrinter.printText("\r\n", {})

      await BluetoothEscposPrinter.printText("CUSTOMER RECEIPT", {
        align: "center",
      })

      await BluetoothEscposPrinter.printText("\r", {})


      // await BluetoothEscposPrinter.printPic(logo, { width: 300, align: "center", left: 30 })


      await BluetoothEscposPrinter.printText(
        "-------------------------------",
        {},
      )
      await BluetoothEscposPrinter.printText("\r\n", {})

      await BluetoothEscposPrinter.printColumn(
        [30],
        [BluetoothEscposPrinter.ALIGN.LEFT],
        ["RCPT. No. : " + rcptNo],
        {},
      )

      await BluetoothEscposPrinter.printColumn(
        [30],
        [BluetoothEscposPrinter.ALIGN.LEFT],
        ["Acc. No. : " + item?.account_number],
        {},
      )

      await BluetoothEscposPrinter.printColumn(
        [30],
        [BluetoothEscposPrinter.ALIGN.LEFT],
        ["Name: " + item?.customer_name],
        {},
      )

      await BluetoothEscposPrinter.printColumn(
        [30],
        [BluetoothEscposPrinter.ALIGN.LEFT],
        ["Previous Bal. : " + item?.current_balance],
        {},
      )

      await BluetoothEscposPrinter.printColumn(
        [30],
        [BluetoothEscposPrinter.ALIGN.LEFT],
        ["Deposit Amt. : " + money],
        {},
      )

      await BluetoothEscposPrinter.printColumn(
        [30],
        [BluetoothEscposPrinter.ALIGN.LEFT],
        ["Current Bal. : " + parseFloat(item?.current_balance + parseFloat(money))],
        {},
      )

      await BluetoothEscposPrinter.printColumn(
        [30],
        [BluetoothEscposPrinter.ALIGN.LEFT],
        [
          "Tnx. Datetime: " +
            new Date(todayDateFromServer).toLocaleDateString("en-GB") + ", " +  new Date(todayDateFromServer).toLocaleTimeString("en-GB")
        ],
        {},
      )

      await BluetoothEscposPrinter.printColumn(
        [30],
        [BluetoothEscposPrinter.ALIGN.LEFT],
        ["Collected By (Code) : " + userId],
        {},
      )

      // await BluetoothEscposPrinter.printText("\r\n", {})

      // await BluetoothEscposPrinter.printText("\r\n", {})
      await BluetoothEscposPrinter.printText(
        "---------------X---------------",
        {},
      )

      await BluetoothEscposPrinter.printText("\r\n\r\n\r\n", {})
    } catch (e) {
      console.log(e.message || "ERROR")
      // ToastAndroid.showWithGravityAndOffset(
      //   "Printer not connected.",
      //   ToastAndroid.SHORT,
      //   ToastAndroid.CENTER,
      //   25,
      //   50,
      // )
    }
  }

  const handleSave = () => {
    getTotalDepositAmount()
    console.log("##$$$$###$$$", maximumAmount, money, totalDepositedAmount)
    console.log("##$$$$+++++###$$$", money + totalDepositedAmount)
    console.log("##$$$$+++++###$$$", typeof money, typeof totalDepositedAmount)
    console.log("##$$$$+++++###$$$", parseFloat(money) + totalDepositedAmount)
    if (!(maximumAmount < parseFloat(money) + totalDepositedAmount)) {
      setIsSaveEnabled(true)
      sendCollectedMoney()
    } else {
      ToastAndroid.showWithGravityAndOffset(
        "Your collection quota has been exceeded.",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
        25,
        50,
      )
    }
  }

  // useEffect(() => {
  //   getTotalDepositAmount()
  // }, [])

  // const sendFinalCollectedMoney = () => {
  //   getTotalDepositAmount()

  //   console.log("Total Deposited Amount", totalDepositedAmount)
  // }

  return (
    <View>
      <CustomHeader />
      <View
        style={{
          backgroundColor: COLORS.lightScheme.background,
          height: "100%",
          padding: 10,
        }}>
        <ScrollView>
          <Text style={styles.info}>Preview</Text>
          {/* Table Component */}
          <View style={styles.tableConatiner}>
            <Table
              borderStyle={{
                borderWidth: 2,
                borderColor: COLORS.lightScheme.onTertiaryContainer,
              }}
              style={{ backgroundColor: COLORS.lightScheme.onTertiary }}>
              <Rows data={tableData} textStyle={styles.text} />
            </Table>
          </View>

          {/* <View style={styles.netTotalTableContainer}>
            <Table
              borderStyle={{ borderWidth: 0, borderColor: COLORS.lightScheme.primary,  }}
              style={{ backgroundColor: COLORS.lightScheme.onTertiary }}>
              <Rows data={netTotalSectionTableData} textStyle={styles.netTotalText} />
            </Table>
          </View> */}

          <View style={styles.inputContainer}>
            <View style={styles.netTotalTableContainer}>
              <Table
                borderStyle={{
                  borderWidth: 1,
                  borderColor: COLORS.lightScheme.primary,
                }}
                style={{
                  backgroundColor: COLORS.lightScheme.secondaryContainer,
                }}>
                <Rows
                  data={netTotalSectionTableData}
                  textStyle={styles.netTotalText}
                />
              </Table>
            </View>
            {/* Input Field */}
            <View style={styles.buttonContainer}>
              <ButtonComponent
                title={"Back"}
                customStyle={{
                  marginTop: 10,
                  backgroundColor: COLORS.lightScheme.error,
                  width: "40%",
                }}
                handleOnpress={() => {
                  navigation.goBack()
                }}
              />
              <ButtonComponent
                title={"Save"}
                customStyle={{ marginTop: 10, width: "40%" }}
                handleOnpress={() => {
                  handleSave()
                }}
                disabled={isSaveEnabled}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  )
}

export default AccountPreview

const styles = StyleSheet.create({
  text: {
    margin: 6,
    color: COLORS.lightScheme.onBackground,
    fontWeight: "400",
    fontSize: 18,
  },
  netTotalTableContainer: {
    padding: 10,
    // backgroundColor: COLORS.lightScheme.primary,
    borderRadius: 15,
  },
  netTotalText: {
    margin: 6,
    color: "teal",
    // fontWeight: 'bold',
    fontSize: 18,
  },
  inputContainer: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: COLORS.lightScheme.secondaryContainer,
    borderRadius: 5,
  },
  info: {
    color: COLORS.lightScheme.primary,
    textAlign: "center",
    fontSize: 22,
    letterSpacing: 5,
    backgroundColor: COLORS.darkScheme.onSecondaryContainer,
    borderRadius: 5,
    marginBottom: 5,
    paddingVertical: 5,
    fontWeight: "600",
  },
  buttonContainer: {
    marginVertical: 10,
    // padding: 10,
    paddingTop: -5,
    backgroundColor: COLORS.darkScheme.onSecondaryContainer,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  tableConatiner: {
    padding: 10,
    backgroundColor: COLORS.lightScheme.onTertiary,
    borderRadius: 5,
  },
})
