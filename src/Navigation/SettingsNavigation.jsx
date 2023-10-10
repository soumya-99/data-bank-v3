import { StyleSheet } from "react-native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import mainNavigationRoutes from "../Routes/NavigationRoutes"
import SettingScreen from "../Screens/SettingsScreens/SettingScreen"
import Profile from "../Screens/SettingsScreens/Profile"
import ChangePin from "../Screens/SettingsScreens/ChangePin"
import EndWork from "../Screens/SettingsScreens/EndWork"
import ReportDay from "../Screens/SettingsScreens/ReportDay"
import ReportChoose from "../Screens/SettingsScreens/ReportChoose"
import NotificationScreen from "../Screens/Notification/NotificationScreen"
import ReportType from "../Screens/SettingsScreens/ReportType"
import PrintMain from "../Screens/PrintConnectScreen/PrintMain"
import NonCollection from "../Screens/SettingsScreens/NonCollection"
import MiniStatement from "../Screens/SettingsScreens/MiniStatement"
import MiniStatementInner from "../Screens/SettingsScreens/MiniStatementInner"

const Stack = createNativeStackNavigator()

const SettingsNavigation = () => {
  return (
    <>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name={mainNavigationRoutes.settingScreen}
          component={SettingScreen}
        />
        <Stack.Screen
          name={mainNavigationRoutes.profileScreen}
          component={Profile}
        />

        <Stack.Screen
          name={mainNavigationRoutes.changePinScreen}
          component={ChangePin}
        />

        <Stack.Screen
          name={mainNavigationRoutes.endWorkScreen}
          component={EndWork}
        />

        <Stack.Screen
          name={mainNavigationRoutes.reportDayScreen}
          component={ReportDay}
        />

        <Stack.Screen
          name={mainNavigationRoutes.reportTypeScreen}
          component={ReportType}
        />

        <Stack.Screen
          name={mainNavigationRoutes.nonCollectionReport}
          component={NonCollection}
        />

        <Stack.Screen
          name={mainNavigationRoutes.miniStatement}
          component={MiniStatement}
        />

        <Stack.Screen
          name={mainNavigationRoutes.miniStatementInner}
          component={MiniStatementInner}
        />

        <Stack.Screen
          name={mainNavigationRoutes.reportChooseScreen}
          component={ReportChoose}
        />

        <Stack.Screen
          name={mainNavigationRoutes.printerConnectScreen}
          component={PrintMain}
        />

        <Stack.Screen
          name={mainNavigationRoutes.notificationScreen}
          component={NotificationScreen}
        />
      </Stack.Navigator>
    </>
  )
}

export default SettingsNavigation

const styles = StyleSheet.create({})
