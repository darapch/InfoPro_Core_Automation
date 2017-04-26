Wait(10)
Call func_setScreenProperty("CREATEACCOUNT")
Wait(10)

If (TEWindow("InfoProWindow").TEScreen("CREATEACCOUNT").TEField("AccountReviewCompletion").Exist(10)) Then
	Environment.Value("ACCOUNTNUMBER") = TEWindow("InfoProWindow").TEScreen("CREATEACCOUNT").TEField("AccountNumber").GetROProperty("text")
	Call func_reportStatus("PASS", "Account Creation screen", "Account Number :" & Environment.Value("ACCOUNTNUMBER") & " created for the quote :"&Environment.Value("QuoteNum"))
Else
	Call func_reportStatus("FAIL", "Account Creation screen", "Account Creation screen does not exist")
End If 'If (TEWindow("InfoProWindow").TEScreen("CREATEACCOUNT").TEField("AccountReviewCompletion").Exist(10)) Then
