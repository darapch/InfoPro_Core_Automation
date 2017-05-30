On Error Resume Next
RepositoriesCollection.Add Environment.Value("RootPath") & "ObjectRepository\InforProOR.tsr"
On Error GoTo 0
'Environment.Value("AccountNumber") = "1127418"

If VerifyScreenHeader("Customer  Service")=False Then	
	Call func_SetReturnCodeToZero()
End If

Call func_EnterValueInTeField("BIGDS021_CustomerService","Search Open Accts Only","Y")	
Call func_sendKey("ENTER")
If Environment.Value("AccountNumber")="" Then
	
	Call func_EnterValueInTeField("BIGDS021_CustomerService","SiteNameField","TEST")
	Call func_sendKey("ENTER")
	wait(3)
	Environment.Value("AccountNumber") = TeWindow("InfoProWindow").TeScreen("BIGDS021_CustomerService").TeField("field id:=642").GetROProperty("text")
	Environment.Value("AccountNumber") = func_SetToMaxFieldLength(Environment.Value("AccountNumber"),7)
	Call func_reportStatus("Pass","Account Number","The Account Number is " & Environment.Value("AccountNumber"))
	
Else
	Environment.Value("AccountNumber") = func_SetToMaxFieldLength(Environment.Value("AccountNumber"),7)
'	Call func_EnterValueInTeField("BIGDS021_CustomerService","AccountNumberHeader",Environment.Value("AccountNumber"))
'	Call func_SendKey("ENTER")
'	wait(2)
'	intAccountFieldID = func_SearchItemInGrid(Environment.Value("AccountNumber"),0)
'	If intAccountFieldID>0 Then
'		Call func_reportStatus("Pass", "Verify Account","The Account Number " & Environment.Value("AccountNumber") & " is displayed at 'Custmer Service' Screen")
'	Else
'		Call func_reportStatus("Fail", "Verify Account","The Account Number " & Environment.Value("AccountNumber") & " is NOT displayed at 'Custmer Service' Screen")
'		Call func_SetReturnCodeToZero()
'	End If
	
End If

Call func_EnterValueInTeField("BIGDS021_CustomerService","AccountNumberHeader",Environment.Value("AccountNumber"))
Call func_SendKey("ENTER")
wait(2)
intAccountFieldID = func_SearchItemInGrid(Environment.Value("AccountNumber"),0)
If intAccountFieldID>0 Then
	Call func_reportStatus("Pass", "Verify Account","The Account Number " & Environment.Value("AccountNumber") & " is displayed at 'Custmer Service' Screen")
Else
	Call func_reportStatus("Fail", "Verify Account","The Account Number " & Environment.Value("AccountNumber") & " is NOT displayed at 'Custmer Service' Screen")
	Call func_SetReturnCodeToZero()
End If

intSiteNoFieldID = intAccountFieldID+8
intSelFieldID = intAccountFieldID+14
intSiteNameFieldID = intAccountFieldID+16
intStreetFieldID = intAccountFieldID+47


strSiteNo = TeWindow("InfoProWindow").TeScreen("BIGDS021_CustomerService").TeField("field id:=" & intSiteNoFieldID).GetROProperty("text")
Environment.Value("Site") = func_SetToMaxFieldLength(strSiteNo,5)

strSiteName = TeWindow("InfoProWindow").TeScreen("BIGDS021_CustomerService").TeField("field id:=" & intSiteNameFieldID).GetROProperty("text")
strStreetAddr = TeWindow("InfoProWindow").TeScreen("BIGDS021_CustomerService").TeField("field id:=" & intStreetFieldID).GetROProperty("text")

TeWindow("InfoProWindow").TeScreen("BIGDS021_CustomerService").TeField("field id:=" & intSelFieldID).Set "1"
Call func_SendKey("ENTER")

TeWindow("InfoProWindow").TeScreen("BIGDS021_CustomerService").TeField("field id:=" & intAccountFieldID).SetCursorPos
Call func_SendKey("TAB")
TeWindow("InfoProWindow").TeScreen("BIGDS021_CustomerService").SendKey "1"
Call func_SendKey("ENTER")

intAccountFieldID = 642
Environment.Value("DivisionNumber") = TeWindow("InfoProWindow").TeScreen("BIGDS021_CustomerService").TeField("DivisionNumber").GetROProperty("text")
Environment.Value("DivisionNumber") = func_SetToMaxFieldLength(Environment.Value("DivisionNumber"),5)
strSiteNumHeader = TeWindow("InfoProWindow").TeScreen("BIGDS021_CustomerService").TeField("SiteNumHeader").GetROProperty("text")
Environment.Value("Site") = strSiteNo
strSiteNameAddressHeader = TeWindow("InfoProWindow").TeScreen("BIGDS021_CustomerService").TeField("SiteNameAddressHeader").GetROProperty("text")
strSiteNameHeader = TeWindow("InfoProWindow").TeScreen("BIGDS021_CustomerService").TeField("SiteNameHeader").GetROProperty("text")

If Trim(strSiteNumHeader)=Trim(strSiteNo) Then
	Call func_reportStatus("Pass", "Verify Populated Site No#","The Populated Site No# : " & strSiteNumHeader & ". The Site No# in the Grid : " & strSiteNo)
Else 
	Call func_reportStatus("Fail", "Verify Populated Site No#","The Populated Site No# : " & strSiteNumHeader & ". The Site No# in the Grid : " & strSiteNo)
End If

If Trim(strSiteNameAddressHeader)=Trim(strStreetAddr) Then
	Call func_reportStatus("Pass", "Verify Populated Address","The Populated Address : " & strSiteNameAddressHeader & ". The Site Address in the Grid : " & strStreetAddr)
Else 
	Call func_reportStatus("Fail", "Verify Populated Address","The Populated Address : " & strSiteNameAddressHeader & ". The Site Address in the Grid : " & strStreetAddr)
End If

If Trim(strSiteNameHeader)=Trim(strSiteName) Then
	Call func_reportStatus("Pass", "Verify Populated Account Name","The Populated Account Name : " & strSiteNameHeader & ". The Site Address in the Grid : " & strSiteName)
Else 
	Call func_reportStatus("Fail", "Verify Populated Account  Name","The Populated Account Name : " & strSiteNameHeader & ". The Site Address in the Grid : " & strSiteName)
End If

'TeWindow("InfoProWindow").TeScreen("BIGDS021_CustomerService").TeField("field id:=" & intSelFieldID).SetCursorPos
'TeWindow("InfoProWindow").TeScreen("BIGDS021_CustomerService").TeField("field id:=" & intSelFieldID).Set "1"




