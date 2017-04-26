Dim obj_LabelProperty
Dim obj_WShell

Call func_setScreenProperty("BIDAA000")

If TEWindow("InfoProWindow").TEScreen("BIDAA000").TEField("AccountReview").Exist(5) Then
	Call func_reportStatus("PASS", "Account Review screen exists", "")
	Set obj_LabelProperty = TEWindow("InfoProWindow").TEScreen("BIDAA000").TEField("QuoteId")
	If obj_LabelProperty.Exist(2) Then
		obj_LabelProperty.Set Environment.Value("QuoteNum")
		Call func_SendKey("ENTER")
		Call func_reportStatus("PASS", "Quote Id field exists", "Quote Id: "&Environment.Value("QuoteNum")& " entered")
		Wait(2)

		If (TEWindow("InfoProWindow").TEScreen("BIDAA000").TEField("ResultCount").Exist(2)) Then
			Call func_SendKey("SELECT")
			Call func_reportStatus("PASS", "Quote Id record retrieved successfully", "Quote Id: "&Environment.Value("QuoteNum")& " record retrieved successfully")
		Else
			Call func_reportStatus("FAIL", "Quote Id record not retrieved", "No Records present for the Quote Id: "&Environment.Value("QuoteNum"))
		End If 'If (TEWindow("InfoProWindow").TEScreen("BIDAA000").TEField("ResultCount").Exist(2)) Then
	Else
		Call func_reportStatus("FAIL", "Quote Id field does not exists", "")
	End If 'If obj_LabelProperty.Exist(2) Then

	If (TEWindow("InfoProWindow").TEScreen("BIDAA000").TEField("DuplicateOrder").Exist(5)) Then
'		Set obj_WShell = CreateObject("wscript.shell")
'		obj_WShell.Sendkeys "{F10}"
		Call func_SendKey("F10")
		Set obj_WShell = Nothing
	End If 'If (TEWindow("InfoProWindow").TEScreen("BIDAA000").TEField("ResultCount").Exist(5)) Then

	Set obj_LabelProperty = Nothing
Else
	Call func_reportFailureScreenshot()
	Call func_reportStatus("FAIL", "Account Review screen does not exists", "")
End If 'If TEWindow("InfoProWindow").TEScreen("BIDAA000").TEField("AccountReview").Exist(5) Then
