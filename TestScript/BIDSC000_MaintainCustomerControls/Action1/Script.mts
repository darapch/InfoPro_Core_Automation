
'Environment.Value("AccountNumber") = "1"
intSpaces = 7-Len(Environment.Value("AccountNumber"))
TeWindow("InfoProWindow").TeScreen("BIDSC000_MaintainCustomerControls").TeField("Customer Number").SetCursorPos intSpaces
TeWindow("InfoProWindow").TeScreen("BIDSC000_MaintainCustomerControls").Sendkey Environment.Value("AccountNumber")

If GetAndVerifyTeFieldValue("BIDSC000_MaintainCustomerControls","Customer Number",Space(intSpaces) & Trim(Environment.Value("AccountNumber"))) Then
	Call func_reportStatus("Pass","Enter the Account Number '" & Space(intSpaces) & Trim(Environment.Value("AccountNumber")) & "'","The Account Number '" & Space(intSpaces) & Trim(Environment.Value("AccountNumber")) & "' is entered")
Else
	 Call func_reportStatus("Fail","Enter the Account Number '" & Space(intSpaces) & Trim(Environment.Value("AccountNumber")) & "'","The Account Number '" & Space(intSpaces) & Trim(Environment.Value("AccountNumber")) & "' is NOT entered")
End If

Call func_SendKey("ENTER")

Call SetEmulatorStatusToReady()

