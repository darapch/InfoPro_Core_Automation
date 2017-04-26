Dim int_rowCount, int_currentRow
Dim str_currentFunc, str_appPath
Dim str_query, str_dataSheet
Dim str_MenuSelection, str_SelectRegion, str_DivisionRegion
Dim int_lenAcctNum
Dim str_selectRegionQuery, str_divisionDataTable
Dim str_PrimarySelection, str_SecondarySelection
Dim str_sendKey
Dim str_path, int_pathCount, arr_path
Dim obj_fso
Dim obj_service, str_process
Dim arr_BIDDS035Fields



'Call CreateTestSetReport("C:\Users\darapch\Desktop\InfoPro_Residence\Reports","Batch")
'Set objExcelDB = CreateObject("ADODB.Connection")
'objExcelDB.Open "Driver={Microsoft Excel Driver (*.xls)};DBQ=C:\Users\darapch\Desktop\InfoPro_Residence\DataSheet\ControlSheet.xls"
'Set objRecordSet = CreateObject("ADODB.RecordSet")
'objRecordSet.Open "select * from [TestCase Execution$] where Execute='Y'",objExcelDB
'intRecords = 0
'
'While NOT objRecordSet.EOF	
'	ReDim Preserve arrTestCases(intRecords)
'	strCurrentTestCase = objRecordSet("TestCase")
'	arrTestCases(intRecords) = strCurrentTestCase	
'	intRecords = intRecords + 1
'	objRecordSet.MoveNext
'Wend
'
'For intTestCase = 0 To UBound(arrTestCases)
	
	'Driver
	Environment.Value("ErrorScreenshot") = ""
	Environment.Value("UName") = ""
	Environment.Value("Password") = ""
	Environment.Value("QuoteNum") = ""
	Environment.Value("AccountNumber") = ""
	Environment.Value("TrimAccountNumber") = ""
	Environment.Value("OrderNum") = ""
	Environment.Value("DivisionNumber") = ""
	Environment.Value("ProjectId") = ""
	Environment.Value("DivisionCode") = ""
	Environment.Value("PrimarySelection") = ""
	Environment.Value("SecondarySelection") = ""
	Environment.Value("StreetName") = ""
	
	'BIGAA001
	Environment.Value("BIGAA001Fields") = ""
	Environment.Value("BIGAA001PrintFeeFields") = ""
	Environment.Value("ShipmentId") = ""
	Environment.Value("ZipCode") = ""
	Environment.Value("WeightCode") = ""
	
	'BIGAA014
	Environment.Value("BIGAA014Fields") = ""
	Environment.Value("ITEM_CODE") = ""
	
	'RateValidation
	Environment.Value("CHARGECODE") = ""
	Environment.Value("CHARGECODE2") = ""
	Environment.Value("TERM") = ""
	
	'CREATEACCOUNT
	Environment.Value("ACCOUNTNUMBER") = ""
	
	'BIDDS035
	Environment.Value("BIDDS035Fields") = ""
	Environment.Value("CSPOTemp") = ""
	Environment.Value("BIDDS035FieldsCount") = ""
	
	'BIGDS024
	Environment.Value("BIGDS024Selection") = ""
	Environment.Value("BIGDS024Reason") = ""
	
	'BIGDS024Processed
	Environment.Value("BIGDS024PageCount") = ""
	
	'BIGRS033"
	Environment.Value("RoutingDate") = ""
	Environment.Value("Route") = ""
	
	
	
	arr_path = Split(Environment.Value("TestDir"), "\")
	Environment.Value("returncode") = 1
	For int_pathCount = 0 To Ubound(arr_path) - 2
		If (int_pathCount = 0) Then
			str_path = 	arr_path(int_pathCount) & "\"
		Else
			str_path = 	str_path & arr_path(int_pathCount) & "\"
		End If 				
'		str_excelFilePath = str_path & "DataSheet\" & arrTestCases(intTestCase) & ".xls"		
		str_excelFilePath = str_path & "DataSheet\" & "Account Address Validation" & ".xls"		
	Next 
	
	arrExcelFilePath = Split(str_excelFilePath,"\")
	strExcelFileName = arrExcelFilePath(UBound(arrExcelFilePath))
	strExcelFileName = Replace(Replace(strExcelFileName,".xls",""),".xlsx","")
	Call CreateReport(str_path & "Reports","HTML,excel",strExcelFileName)
	
	Reporter.ReportEvent micDone, "START RUN", Now()
	
	Set obj_fso = CreateObject("Scripting.FileSystemObject")
	
	If (obj_fso.FileExists(str_excelFilePath)) Then
		'SystemUtil.CloseProcessByName("Excel.exe")
	   	DataTable.ImportSheet str_excelFilePath,1,"Global"
	   	Call func_reportStatus("PASS", "Excel file loaded sucessfully", "")
	Else
		Call func_reportStatus("FAIL", "Excel file does not exist", err.description)
	End If 'If (obj_fso.FileExists(str_excelFilePath)) Then
	
	Set obj_fso = Nothing
	
	int_rowCount = DataTable.GetSheet("Global").GetRowCount
	
	For int_currentRow = 1 To int_rowCount
		DataTable.GetSheet("Global").SetCurrentRow(int_currentRow)
	
		str_currentFunc = Trim(DataTable.Value("Function", "Global"))
	
		Select Case UCASE(TRIM(str_currentFunc))
			Case "INVOKEAPPLICATION"				
				Set obj_service = GetObject ("winmgmts:")
				For Each str_process in obj_service.InstancesOf ("Win32_Process")
					If Ucase(Trim(str_process.Name)) = "PCSWS.EXE" Then
						SystemUtil.CloseProcessByName("pcsws.exe")
						SystemUtil.CloseProcessByName("pcscm.exe")
					End If 'If str_process.Name = "pcsws.exe *32" Then
				Next 'For Each str_process in obj_service.InstancesOf ("Win32_Process")
				Set obj_service = Nothing
	
				str_appPath = Trim(DataTable.Value("Parameter1", "Global"))
				Call func_invokeapplication(str_appPath)
				Wait(5)
	
			Case "LOGIN"
			If Environment.Value("returncode") = 1 Then
				Environment.Value("UName") = Trim(DataTable.Value("Parameter1", "Global"))
				Environment.Value("Password") = Trim(DataTable.Value("Parameter2", "Global"))
				
				If Dialog("Configure PC5250").Exist Then
					Call func_handleLoginPopup("Configure PC5250")
				End If 'If Dialog("Configure PC5250").Exist Then
				
				If Dialog("System i signon").Exist Then
					Call func_handleLoginPopup("System i signon")
				End If 'If Dialog("System i signon").Exist Then
	
	'			If TEWindow("InfoProWindow").Exist Then
	'				Call func_Login()
	'			End If 'If TEWindow("InfoProWindow").Exist Then
	
				If TEWindow("InfoProWindow").TEScreen("Login").TEField("UserId").Exist(10) Then
				Call func_Login()
				Else
				Call func_reportFailureScreenshot()
				Call func_reportStatus("FAIL", "Login Screen", "Login Screen does not exist")
				End If 'If TEWindow("InfoProWindow").TEScreen("Login").TEField("SignOn").Exist(10) Then
			End If	
			Case "MENUSELECTION"
				If Environment.Value("returncode") = 1 Then
					str_MenuSelection = Trim(DataTable.Value("Parameter1", "Global"))
					
					'Added By Krishna
					'***********************
					'TEWindow("InfoProWindow").TEScreen("Menu").TEField(str_MenuSelection).Set 1
					Call func_EnterValueInTeField("Menu",str_MenuSelection,1)
					Call SaveScreenShot()
					'***********************
					Call func_SendKey("ENTER")
				End If
			Case "RETRIEVEDATA"
			If Environment.Value("returncode") = 1 Then
				str_query = Trim(DataTable.Value("Parameter1", "Global"))
				str_dataSheet = Trim(DataTable.Value("Parameter2", "Global"))
				Call func_retrieveData(str_query, str_dataSheet)
				Environment.Value("QuoteNum") = Ucase(Trim(DataTable.Value("PVARCHAR2", "ACCOUNTINFO")))
				Environment.Value("OrderNum") = Mid(Environment.Value("QuoteNum"),2)
				Environment.Value("DivisionNumber") = Trim(DataTable.Value("DIVISION", "ACCOUNTINFO"))
				Environment.Value("ProjectId") = Ucase(Trim(DataTable.Value("PROJECTID", "ACCOUNTINFO")))
				Environment.Value("AccountNumber") = Ucase(Trim(DataTable.Value("AAACCT", "ACCOUNTINFO")))
				
				int_lenAcctNum = Len(Trim(Environment.Value("AccountNumber")))
		
				If int_lenAcctNum = 4 Then
					Environment.Value("TrimAccountNumber") = "   "&Trim(Environment.Value("AccountNumber"))
				ElseIf int_lenAcctNum = 5 Then
					Environment.Value("TrimAccountNumber") = "  "&Trim(Environment.Value("AccountNumber"))
				ElseIf int_lenAcctNum = 6 Then
					Environment.Value("TrimAccountNumber") = " "&Trim(Environment.Value("AccountNumber"))
				Else
					Msgbox("Account Number less than 4 digits. Please Check")
				End If 'If int_lenAcctNum = 4 Then
				
				Reporter.ReportEvent micDone, "QUOTE NUMBER : ", Environment.Value("QuoteNum")
	
				Environment.Value("ErrorScreenshot") = str_path & Environment.Value("QuoteNum") & "_error.png"
	
				Set obj_fso = CreateObject("Scripting.FileSystemObject")
				If (obj_fso.FileExists(Environment.Value("ErrorScreenshot"))) Then
					obj_fso.DeleteFile(Environment.Value("ErrorScreenshot"))
				End If 'If (obj_fso.FileExists(Environment.Value("ErrorScreenshot"))) Then
				Set obj_fso = Nothing
			End If
			Case "REGIONSELECTION"
				'Added By Krishna
				If Environment.Value("returncode") = 1 Then
					If DataTable.Value("Parameter1", "Global")<>"" Then
						Environment.Value("RegionCode") = Trim(DataTable.Value("Parameter1", "Global"))
					Else
						str_selectRegionQuery = "Select * from cufile.BIPIC where ICCOMP = '  "&Environment.Value("DivisionNumber")&"'"
						str_divisionDataTable = "DIVISION"
						Call func_retrieveData(str_selectRegionQuery, str_divisionDataTable)
						Environment.Value("DivisionCode") = Ucase(Trim(DataTable.Value("ICREG", "DIVISION")))
						'Call func_RegionSelection()
					End If
					Call func_RegionSelection()
				End If			
			Case "DIVISIONSELECTION"
				'Added By Krishna
				If Environment.Value("returncode") = 1 Then
					If DataTable.Value("Parameter1", "Global")<>"" Then
						Environment.Value("DivisionNumber") = Trim(UCase(DataTable.Value("Parameter1", "Global")))
					End If
					Call func_DivisionSelection(Environment.Value("DivisionNumber"))
				End If				
	
			Case "PRIMARYSELECTION"
				If Environment.Value("returncode") = 1 Then
					Environment.Value("PrimarySelection") = Trim(DataTable.Value("Parameter1", "Global"))
					Call func_PrimarySelection(Environment.Value("PrimarySelection"))
				End If
				
	
			Case "SECONDARYSELECTION"
				If Environment.Value("returncode") = 1 Then
					Environment.Value("SecondarySelection") = Trim(DataTable.Value("Parameter1", "Global"))
					
					If (Environment.Value("PrimarySelection") = "CustomerMaintenance") Then
						If (UCASE(Trim(DataTable.Value("CONS_AAE", "ACCOUNTINFO"))) = "Y") Then
							Call func_SecondrySelection("ConsolidatedAutoAccountEntry")
						Else
							Call func_SecondrySelection("AutoAccountEntryMaintainAccts")
						End If 'If (UCASE(Trim(DataTable.Value("CONS_AAE", "ACCOUNTINFO"))) = "Y") Then
					ElseIf (Environment.Value("SecondarySelection") <> "") Then
						Call func_SecondrySelection(Environment.Value("SecondarySelection"))
					Else
						Msgbox("Secondry Selection not present in data sheet")
					End If 'If (Environment.Value("PrimarySelection") = "CustomerMaintenance") Then
				End If
			Case "SENDKEY"
				If Environment.Value("returncode") = 1 Then
					str_sendKey = Trim(DataTable.Value("Parameter1", "Global"))
					Call func_SendKey(str_sendKey)
				End If
			Case "BIDAA000"
			
				If Environment.Value("returncode") = 1 Then
					On Error Resume Next
					'LoadAndRunAction str_path & "TestScript\BIDAA000", "Action1", oneIteration					
					RunAction "Action1 [BIDAA000]", oneIteration					
					If Err.number<>0 then
						Call func_reportStatus("fail",UCASE(TRIM(str_currentFunc)) & " : " & Err.description,err.description)						
					End If
					On Error Goto 0
				End If
			Case "BIGAA001"
				If Environment.Value("returncode") = 1 Then
					Environment.Value("BIGAA001Fields") = Trim(DataTable.Value("Parameter1", "Global"))
					Environment.Value("BIGAA001PrintFeeFields") = Trim(DataTable.Value("Parameter2", "Global"))
					'LoadAndRunAction str_path & "TestScript\BIGAA001", "Action1", oneIteration
					RunAction "Action1 [BIGAA001]", oneIteration
				End If
				
			Case "CUGAACST01"
				If Environment.Value("returncode") = 1 Then
					'LoadAndRunAction str_path & "TestScript\CUGAACST01", "Action1", oneIteration
					RunAction "Action1 [CUGAACST01]", oneIteration
				End If
			Case "CUGAACST01_2"
				If Environment.Value("returncode") = 1 Then
					'LoadAndRunAction str_path & "TestScript\CUGAACST01_2", "Action1", oneIteration
					RunAction "Action1 [CUGAACST01_2]", oneIteration
				End If
			Case "BIGAA014"
				If Environment.Value("returncode") = 1 Then
					Environment.Value("BIGAA014Fields") = Trim(DataTable.Value("Parameter1", "Global"))
					'LoadAndRunAction str_path & "TestScript\BIGAA014", "Action1", oneIteration
					RunAction "Action1 [BIGAA014]", oneIteration
				End If
			Case "BIGAA014_OVERRIDE"
				If Environment.Value("returncode") = 1 Then
					'LoadAndRunAction str_path & "TestScript\BIGAA014_Override", "Action1", oneIteration
					RunAction "Action1 [BIGAA014_Override]", oneIteration
				End If
			Case "GENERATEDELIVERIES"
				If Environment.Value("returncode") = 1 Then
					Call func_SendKey("F10")
				End If
			Case "RATEVALIDATION"
				If Environment.Value("returncode") = 1 Then
					'LoadAndRunAction str_path & "TestScript\RateValidation", "Action1", oneIteration
					RunAction "Action1 [RateValidation]", oneIteration
				End If
			Case "BIGAA014R"
				If Environment.Value("returncode") = 1 Then
					LoadAndRunAction str_path & "TestScript\BIGAA014R", "Action1", oneIteration
					RunAction "Action1 [BIGAA014R]", oneIteration
				End If
			Case "CREATEACCOUNT"
				If Environment.Value("returncode") = 1 Then
					'Call func_SendKey("F10")
					'Wait(10)
					'LoadAndRunAction str_path & "TestScript\CREATEACCOUNT", "Action1", oneIteration
					RunAction "Action1 [CREATEACCOUNT]", oneIteration
				End If
			Case "BIRC01"
				If Environment.Value("returncode") = 1 Then
					Environment.Value("StreetName") = Trim(DataTable.Value("Parameter1", "Global"))
					'LoadAndRunAction str_path & "TestScript\BIRC01", "Action1", oneIteration
					RunAction "Action1 [BIRC01]", oneIteration
				End If
			Case "BIDDS035"
				If Environment.Value("returncode") = 1 Then
					Environment.Value("BIDDS035Fields") = Trim(DataTable.Value("Parameter1", "Global"))
					'LoadAndRunAction str_path & "TestScript\BIDDS035", "Action1", oneIteration
					RunAction "Action1 [BIDDS035]", oneIteration
				End If
			Case "BIGDS024"
				If Environment.Value("returncode") = 1 Then
					Environment.Value("BIGDS024Selection") = Trim(DataTable.Value("Parameter1", "Global"))
					Environment.Value("BIGDS024Reason") = Trim(DataTable.Value("Parameter2", "Global"))
					'LoadAndRunAction str_path & "TestScript\BIGDS024", "Action1", oneIteration
					RunAction "Action1 [BIGDS024]", oneIteration
				End If
			Case "BIGDS024PROCESSED"
				If Environment.Value("returncode") = 1 Then
					'LoadAndRunAction str_path & "TestScript\BIGDS024Processed", "Action1", oneIteration
					RunAction "Action1 [BIGDS024PROCESSED]", oneIteration
				End If
			Case "BIGRS033"
				If Environment.Value("returncode") = 1 Then
					Environment.Value("RoutingDate") = Trim(DataTable.Value("Parameter1", "Global"))
					Environment.Value("Route") = Trim(DataTable.Value("Parameter2", "Global"))
					'LoadAndRunAction str_path & "TestScript\BIGRS033", "Action1", oneIteration
					RunAction "Action1 [BIGRS033]", oneIteration
				End If
			Case "BIGDS000"
				If Environment.Value("returncode") = 1 Then
					'LoadAndRunAction str_path & "TestScript\BIGDS000", "Action1", oneIteration
					RunAction "Action1 [BIGDS000]", oneIteration
				End If
			Case "BIRC01_ROUTE"
				If Environment.Value("returncode") = 1 Then
					'LoadAndRunAction str_path & "TestScript\BIRC01_Route", "Action1", oneIteration
					RunAction "Action1 [BIRC01_ROUTE]", oneIteration
				End If
			Case "BIR002"
				If Environment.Value("returncode") = 1 Then
					'LoadAndRunAction str_path & "TestScript\BIR002", "Action1", oneIteration
					RunAction "Action1 [BIR002]", oneIteration
				End If
			Case "BIDRS005"
				If Environment.Value("returncode") = 1 Then
					Environment.Value("InputFields") = Trim(DataTable.Value("Parameter1", "Global"))	
					RunAction "Action1 [BIDRS005]", oneIteration
				End If
			Case "BIGDS001_02" 'Added by Krishna
				If Environment.Value("returncode") = 1 Then
					If DataTable.Value("Parameter1", "Global")<>"" Then
						Environment.Value("Route") = Trim(DataTable.Value("Parameter1", "Global"))
					End If
					Environment.Value("NavigateBackTOSelection") = Trim(DataTable.Value("Parameter2", "Global"))					
					RunAction "Action1 [BIGDS001_02]", oneIteration
				End If
			Case "STDJC20_EODDISPATCH" 'Added by Krishna
				
				If Environment.Value("returncode") = 1 Then
					RunAction "Action1 [STDJC20_EOD Dispatch]", oneIteration
				End If	
			Case "BIGDS021_CUSTOMERSERVICE" 'Added by Krishna
				
				If Environment.Value("returncode") = 1 Then	
					Environment.Value("AccountNumber") = Trim(DataTable.Value("Parameter1"))	
					'msgbox str_path
					'RunAction "Action1 [BIGDS021_CustomerService]", oneIteration
					LoadAndRunAction str_path & "TestScript\BIGDS021_CustomerService","Action1",oneIteration
					
					'LoadAndRunAction "\\..\..\TestScript\BIGDS021_CustomerService","Action1",oneIteration
				End If
			Case "BIDSC001_ACCOUNT INFORMATION"	'Added by Krishna
				If Environment.Value("returncode") = 1 Then	
					Environment.Value("Purpose") = Trim(DataTable.Value("Parameter0"))
					Environment.Value("City") = Trim(DataTable.Value("Parameter1"))
					Environment.Value("State") = Trim(DataTable.Value("Parameter2"))
					Environment.Value("ZIP") = Trim(DataTable.Value("Parameter3"))
					RunAction "Action1 [BIDSC001_ACCOUNT INFORMATION]", oneIteration
				End If
			Case "BIDSC015_CONTAINER SELECTION SCREEN"	'Added by Krishna
				If Environment.Value("returncode") = 1 Then	
				    If DataTable.Value("Parameter0")<>"" Then
				    	Environment.Value("Purpose") = Trim(DataTable.Value("Parameter0"))
				    Else
				    	Environment.Value("Purpose") = DataTable.Value("Parameter0")
				    End If
					
					Environment.Value("SiteNumber") = Trim(DataTable.Value("Parameter1"))
					Environment.Value("ContainerGroup") = Trim(DataTable.Value("Parameter2"))
					Environment.Value("Status") = Trim(DataTable.Value("Parameter3"))
					
					RunAction "Action1 [BIDSC015_CONTAINER SELECTION SCREEN]", oneIteration
				End If
		End Select 'Select Case UCASE(TRIM(str_currentFunc))
	Next 'For int_currentRow = 1 To int_rowCount
	
'	Call AddTestSetRow(arrTestCases(intTestCase),"PASS",Environment.Value("HTMLResultFilePath"))

'Next


 

'Call SelectFieldByText("INFOPRO  . . . . . . . . . . . .","tab")
'TeWindow("short name:=A").TeScreen("column count:=80").SendKey TE_ENTER
'Call SelectFieldByText("BIDBFD","backtab")

 




		 		

Function CreateTestSetReport(strResultFileROOTPath,strResultFileNAME)		 		
	Set objFSO = CreateObject("Scripting.FileSystemObject")	
	strTimeStamp = Replace(Date,"/","") & "_" & Hour(now) & "_" & Minute(now) & "_" & Second(now)
	strReportFolderPath = strResultFileROOTPath & "\" & strResultFileNAME & "_" & strTimeStamp
 	objFSO.CreateFolder(strReportFolderPath)
 	strFolderName = objFSO.GetFolder(strReportFolderPath).Name
 	arrstrFileType = Split(strFileType,",")	 	 		
	Set objFile = CreateObject("scripting.filesystemobject")	
	Environment.Value("HTMLPath_TestSet") = strReportFolderPath & "\" & strFolderName & ".html"
	Set ObjFileName = objFile.CreateTextFile(Environment.Value("HTMLPath_TestSet"),True,False)	
	ObjFileName.writeline "<TABLE border=1>" & "<TR>" & "<TH BGCOLOR=LightSlateGray text=white>" & "Test Case" & "</TH>" & "<TH BGCOLOR=LightSlateGray text=white>" & "Status" & "</TH>" & "<TH BGCOLOR=LightSlateGray text=white>" & "Report" & "</TH>" & "</TR>"					 	
 End Function
 
 Function AddTestSetRow(strTestCaseName,strExecutionStatus,strReportFilePath)	
	 	strHTMLPath_TestSet = Environment.Value("HTMLPath_TestSet")
	 	Set objFso = CreateObject("Scripting.FileSystemObject")
	 	Set objFile = objFso.OpenTextFile(strHTMLPath_TestSet, 8,TRUE)
	 	Select Case UCase(strExecutionStatus)
	 		Case "PASS"
	 			strFontColor = "Green"	 			
	 		Case "FAIL"
	 			strFontColor = "Red"	 			
	 		Case "DONE"
	 			strFontColor = "Grey"
	 	End Select 	
	 	objFile.WriteLine "<TR>" & "<TD>" & strTestCaseName & "</TD>"  & "<TD>" & strExecutionStatus & "</TD>" & "<TD>" & "<A HREF=" & strReportFilePath & ">Report</A></TD></TR>"    	 		
 End Function



 
