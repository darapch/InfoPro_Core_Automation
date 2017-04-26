Dim obj_LabelProperty

Call func_setScreenProperty("BIRC01")

If TEWindow("InfoProWindow").TEScreen("BIRC01").TEField("CustomerService").Exist(5) Then
	Call func_reportStatus("PASS", "Customer Service screen exists", "")
	
	Set obj_LabelProperty = TEWindow("InfoProWindow").TEScreen("BIRC01").TEField("ASSADR")
	If obj_LabelProperty.Exist(2) Then
		obj_LabelProperty.Set Environment.Value("StreetName")
		
		Call func_SendKey("ENTER")
		Call func_reportStatus("PASS", "Address field exists", "Address: "&Environment.Value("AccountNumber")& " entered")
		Wait(2)
		
		TEWindow("InfoProWindow").TEScreen("BIRC01").TEField("CustomerServiceSelection").Set "1"
		Call func_SendKey("ENTER")
	Else
		Call func_reportStatus("FAIL", "Address field does not exists", "")
	End If 'If obj_LabelProperty.Exist(2) Then
	
	'Set obj_LabelProperty = TEWindow("InfoProWindow").TEScreen("BIRC01")
	'If obj_LabelProperty.TEField("ASACCT").Exist(2) Then
	'	
	'	obj_LabelProperty.TEField("ASACCT").Set Environment.Value("TrimAccountNumber")
	'	obj_LabelProperty.TEField("ASSADR").Set Environment.Value("StreetName")
	'	
	'	Call func_SendKey("ENTER")
	'	Call func_reportStatus("PASS", "Account Number field exists", "Account Number: "&Environment.Value("AccountNumber")& " entered")
	'	Wait(2)
	'	
	'	TEWindow("InfoProWindow").TEScreen("BIRC01").TEField("CustomerServiceSelection").Set "1"
	'	Call func_SendKey("ENTER")
	'Else
	'	Call func_reportStatus("FAIL", "Account Number field does not exists", "")
	'End If 'If obj_LabelProperty.Exist(2) Then

	Set obj_LabelProperty = Nothing
Else
	Call func_reportFailureScreenshot()
	Call func_reportStatus("FAIL", "Customer Service screen does not exists", "")
End If 'If TEWindow("InfoProWindow").TEScreen("BIDAA000").TEField("CustomerService").Exist(5) Then
