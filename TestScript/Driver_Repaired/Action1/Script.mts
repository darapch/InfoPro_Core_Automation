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

Services.StartTransaction "StartRun"

Environment.Value("RootPath") = Split(Environment.Value("TestDir"),"TestScript")(0)
ExecuteFile Environment.Value("RootPath") & "Config\Configuration.vbs"
	
	If Environment.Value("is_batchrun")=false Then
		Environment.Value("CurrentTestDataSheet") = "Site Address Validation"			
	End If
	
	arr_path = Split(Environment.Value("TestDir"), "\")
	
	
	str_excelFilePath = Environment.Value("RootPath") & "DataSheet\" & Environment.Value("CurrentTestDataSheet") & ".xls"
	
	arrExcelFilePath = Split(str_excelFilePath,"\")
	strReportFileName = arrExcelFilePath(UBound(arrExcelFilePath))
	strReportFileName = Replace(Replace(strReportFileName,".xls",""),".xlsx","")
	Call CreateReport(Environment.Value("RootPath") & "Reports","HTML",strReportFileName)
	
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
	Environment.Value("returncode") = 1
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
'			If Environment.Value("returncode") = 1 Then
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
'			End If	
			Case "MENUSELECTION"
'				If Environment.Value("returncode") = 1 Then
					str_MenuSelection = Trim(DataTable.Value("Parameter1", "Global"))
					
					'Added By Krishna
					'***********************
					'TEWindow("InfoProWindow").TEScreen("Menu").TEField(str_MenuSelection).Set 1
					Call func_EnterValueInTeField("Menu",str_MenuSelection,1)
					Call SaveScreenShot()
					'***********************
					Call func_SendKey("ENTER")
'				End If
			Case "RETRIEVEDATA"
'			If Environment.Value("returncode") = 1 Then
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
'			End If
			Case "REGIONSELECTION"
				'Added By Krishna
'				If Environment.Value("returncode") = 1 Then
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
'				End If			
			Case "DIVISIONSELECTION"
				'Added By Krishna
'				If Environment.Value("returncode") = 1 Then
					If DataTable.Value("Parameter1", "Global")<>"" Then
						Environment.Value("DivisionNumber") = Trim(UCase(DataTable.Value("Parameter1", "Global")))
					End If
					Call func_DivisionSelection(Environment.Value("DivisionNumber"))
'				End If				
	
			Case "PRIMARYSELECTION"
'				If Environment.Value("returncode") = 1 Then
					Environment.Value("PrimarySelection") = Trim(DataTable.Value("Parameter1", "Global"))
					'Call func_PrimarySelection(Environment.Value("PrimarySelection"))
					Call func_PrimarySelectionUpdated(Environment.Value("PrimarySelection"))
'				End If
				
	
			Case "SECONDARYSELECTION"
'				If Environment.Value("returncode") = 1 Then
					Environment.Value("SecondarySelection") = Trim(DataTable.Value("Parameter1", "Global"))
					
					If (Environment.Value("PrimarySelection") = "CustomerMaintenance") Then
						If (UCASE(Trim(DataTable.Value("CONS_AAE", "ACCOUNTINFO"))) = "Y") Then
							'Call func_SecondrySelection("ConsolidatedAutoAccountEntry")
							Call func_SecondarySelectionUpdated("Consolidated Auto Account Entry")
						Else
							'Call func_SecondrySelection("AutoAccountEntryMaintainAccts")
							Call func_SecondarySelectionUpdated("Auto Account Entry-Maintain Accts")
							
						End If 'If (UCASE(Trim(DataTable.Value("CONS_AAE", "ACCOUNTINFO"))) = "Y") Then
					ElseIf (Environment.Value("SecondarySelection") <> "") Then
						'Call func_SecondrySelection(Environment.Value("SecondarySelection"))
						Call func_SecondarySelectionUpdated(Environment.Value("SecondarySelection"))
					Else
						Call func_SetReturnCodeToZero()
						'Msgbox("Secondry Selection not present in data sheet")
					End If 'If (Environment.Value("PrimarySelection") = "CustomerMaintenance") Then
'				End If
			Case "SENDKEY"
'				If Environment.Value("returncode") = 1 Then
					str_sendKey = Trim(DataTable.Value("Parameter1", "Global"))
					Call func_SendKey(str_sendKey)
'				End If
			Case "BIDAA000"
				If Environment.Value("returncode") = 0 Then
					Call func_reportStatus("Fail","Execution Stopped","Execution Stopped and Unable to Proceed to " & str_currentFunc)
					ExitAction
				End If					
				LoadAndRunAction Environment.Value("RootPath") & "TestScript\BIDAA000", "Action1", oneIteration					
				
			Case "BIGAA001"
				If Environment.Value("returncode") = 0 Then
					Call func_reportStatus("Fail","Execution Stopped","Execution Stopped and Unable to Proceed to " & str_currentFunc)
					ExitAction
				End If
'				If Environment.Value("returncode") = 1 Then
					Environment.Value("BIGAA001Fields") = Trim(DataTable.Value("Parameter1", "Global"))
					Environment.Value("BIGAA001PrintFeeFields") = Trim(DataTable.Value("Parameter2", "Global"))
					LoadAndRunAction Environment.Value("RootPath") & "TestScript\BIGAA001", "Action1", oneIteration					
'				End If
				
			Case "CUGAACST01"
				If Environment.Value("returncode") = 0 Then
					Call func_reportStatus("Fail","Execution Stopped","Execution Stopped and Unable to Proceed to " & str_currentFunc)
					ExitAction
				End If
'				If Environment.Value("returncode") = 1 Then
					LoadAndRunAction Environment.Value("RootPath") & "TestScript\CUGAACST01", "Action1", oneIteration					
'				End If
			Case "CUGAACST01_2"
				If Environment.Value("returncode") = 0 Then
					Call func_reportStatus("Fail","Execution Stopped","Execution Stopped and Unable to Proceed to " & str_currentFunc)
					ExitAction
				End If
'				If Environment.Value("returncode") = 1 Then
					LoadAndRunAction Environment.Value("RootPath") & "TestScript\CUGAACST01_2", "Action1", oneIteration
					RunAction "Action1 [CUGAACST01_2]", oneIteration
'				End If
			Case "BIGAA014"
				If Environment.Value("returncode") = 0 Then
					Call func_reportStatus("Fail","Execution Stopped","Execution Stopped and Unable to Proceed to " & str_currentFunc)
					ExitAction
				End If
'				If Environment.Value("returncode") = 1 Then
					Environment.Value("BIGAA014Fields") = Trim(DataTable.Value("Parameter1", "Global"))
					LoadAndRunAction Environment.Value("RootPath") & "TestScript\BIGAA014", "Action1", oneIteration
					
'				End If
			Case "BIGAA014_OVERRIDE"
				If Environment.Value("returncode") = 0 Then
					Call func_reportStatus("Fail","Execution Stopped","Execution Stopped and Unable to Proceed to " & str_currentFunc)
					ExitAction
				End If
'				If Environment.Value("returncode") = 1 Then
					LoadAndRunAction Environment.Value("RootPath") & "TestScript\BIGAA014_Override", "Action1", oneIteration
					
'				End If
			Case "GENERATEDELIVERIES"
				If Environment.Value("returncode") = 0 Then
					Call func_reportStatus("Fail","Execution Stopped","Execution Stopped and Unable to Proceed to " & str_currentFunc)
					ExitAction
				End If
'				If Environment.Value("returncode") = 1 Then
					Call func_SendKey("F10")
'				End If
			Case "RATEVALIDATION"
				If Environment.Value("returncode") = 0 Then
					Call func_reportStatus("Fail","Execution Stopped","Execution Stopped and Unable to Proceed to " & str_currentFunc)
					ExitAction
				End If
'				If Environment.Value("returncode") = 1 Then
					LoadAndRunAction Environment.Value("RootPath") & "TestScript\RateValidation", "Action1", oneIteration
					'RunAction "Action1 [RateValidation]", oneIteration
'				End If
			Case "BIGAA014R"
				If Environment.Value("returncode") = 0 Then
					Call func_reportStatus("Fail","Execution Stopped","Execution Stopped and Unable to Proceed to " & str_currentFunc)
					ExitAction
				End If
'				If Environment.Value("returncode") = 1 Then
					LoadAndRunAction Environment.Value("RootPath") & "TestScript\BIGAA014R", "Action1", oneIteration
					'RunAction "Action1 [BIGAA014R]", oneIteration
'				End If
			Case "CREATEACCOUNT"
				If Environment.Value("returncode") = 0 Then
					Call func_reportStatus("Fail","Execution Stopped","Execution Stopped and Unable to Proceed to " & str_currentFunc)
					ExitAction
				End If
'				If Environment.Value("returncode") = 1 Then
					'Call func_SendKey("F10")
					'Wait(10)
					LoadAndRunAction Environment.Value("RootPath") & "TestScript\CREATEACCOUNT", "Action1", oneIteration
					'RunAction "Action1 [CREATEACCOUNT]", oneIteration
'				End If
			Case "BIRC01"
				If Environment.Value("returncode") = 0 Then
					Call func_reportStatus("Fail","Execution Stopped","Execution Stopped and Unable to Proceed to " & str_currentFunc)
					ExitAction
				End If
'				If Environment.Value("returncode") = 1 Then
					Environment.Value("StreetName") = Trim(DataTable.Value("Parameter1", "Global"))
					LoadAndRunAction Environment.Value("RootPath") & "TestScript\BIRC01", "Action1", oneIteration
					'RunAction "Action1 [BIRC01]", oneIteration
'				End If
			Case "BIDDS035"
				If Environment.Value("returncode") = 0 Then
					Call func_reportStatus("Fail","Execution Stopped","Execution Stopped and Unable to Proceed to " & str_currentFunc)
					ExitAction
				End If
'				If Environment.Value("returncode") = 1 Then
					Environment.Value("BIDDS035Fields") = Trim(DataTable.Value("Parameter1", "Global"))
					LoadAndRunAction Environment.Value("RootPath") & "TestScript\BIDDS035", "Action1", oneIteration
					'RunAction "Action1 [BIDDS035]", oneIteration
'				End If
			Case "BIGDS024"
				If Environment.Value("returncode") = 0 Then
					Call func_reportStatus("Fail","Execution Stopped","Execution Stopped and Unable to Proceed to " & str_currentFunc)
					ExitAction
				End If
'				If Environment.Value("returncode") = 1 Then
					Environment.Value("BIGDS024Selection") = Trim(DataTable.Value("Parameter1", "Global"))
					Environment.Value("BIGDS024Reason") = Trim(DataTable.Value("Parameter2", "Global"))
					LoadAndRunAction Environment.Value("RootPath") & "TestScript\BIGDS024", "Action1", oneIteration
					'RunAction "Action1 [BIGDS024]", oneIteration
'				End If
			Case "BIGDS024PROCESSED"
				If Environment.Value("returncode") = 0 Then
					Call func_reportStatus("Fail","Execution Stopped","Execution Stopped and Unable to Proceed to " & str_currentFunc)
					ExitAction
				End If
'				If Environment.Value("returncode") = 1 Then
					LoadAndRunAction Environment.Value("RootPath") & "TestScript\BIGDS024Processed", "Action1", oneIteration
					'RunAction "Action1 [BIGDS024PROCESSED]", oneIteration
'				End If
			Case "BIGRS033"
				If Environment.Value("returncode") = 0 Then
					Call func_reportStatus("Fail","Execution Stopped","Execution Stopped and Unable to Proceed to " & str_currentFunc)
					ExitAction
				End If
'				If Environment.Value("returncode") = 1 Then
					Environment.Value("RoutingDate") = Trim(DataTable.Value("Parameter1", "Global"))
					Environment.Value("Route") = Trim(DataTable.Value("Parameter2", "Global"))
					LoadAndRunAction Environment.Value("RootPath") & "TestScript\BIGRS033", "Action1", oneIteration
					'RunAction "Action1 [BIGRS033]", oneIteration
'				End If
			Case "BIGDS000"
				If Environment.Value("returncode") = 0 Then
					Call func_reportStatus("Fail","Execution Stopped","Execution Stopped and Unable to Proceed to " & str_currentFunc)
					ExitAction
				End If
'				If Environment.Value("returncode") = 1 Then
					LoadAndRunAction Environment.Value("RootPath") & "TestScript\BIGDS000", "Action1", oneIteration
					'RunAction "Action1 [BIGDS000]", oneIteration
'				End If
			Case "BIRC01_ROUTE"
				If Environment.Value("returncode") = 0 Then
					Call func_reportStatus("Fail","Execution Stopped","Execution Stopped and Unable to Proceed to " & str_currentFunc)
					ExitAction
				End If
'				If Environment.Value("returncode") = 1 Then
					LoadAndRunAction Environment.Value("RootPath") & "TestScript\BIRC01_Route", "Action1", oneIteration
					'RunAction "Action1 [BIRC01_ROUTE]", oneIteration
'				End If
			Case "BIR002"
				If Environment.Value("returncode") = 0 Then
					Call func_reportStatus("Fail","Execution Stopped","Execution Stopped and Unable to Proceed to " & str_currentFunc)
					ExitAction
				End If
'				If Environment.Value("returncode") = 1 Then
					LoadAndRunAction Environment.Value("RootPath") & "TestScript\BIR002", "Action1", oneIteration
					'RunAction "Action1 [BIR002]", oneIteration
'				End If
			Case "BIDRS005"
				If Environment.Value("returncode") = 0 Then
					Call func_reportStatus("Fail","Execution Stopped","Execution Stopped and Unable to Proceed to " & str_currentFunc)
					ExitAction
				End If
'				If Environment.Value("returncode") = 1 Then
					Environment.Value("InputFields") = Trim(DataTable.Value("Parameter1", "Global"))	
					LoadAndRunAction Environment.Value("RootPath") & "TestScript\BIDRS005","Action1", oneIteration
'				End If
			Case "BIGDS001_02" 'Added by Krishna
				If Environment.Value("returncode") = 0 Then
					Call func_reportStatus("Fail","Execution Stopped","Execution Stopped and Unable to Proceed to " & str_currentFunc)
					ExitAction
				End If
'				If Environment.Value("returncode") = 1 Then
					If DataTable.Value("Parameter1", "Global")<>"" Then
						Environment.Value("Route") = Trim(DataTable.Value("Parameter1", "Global"))
					End If

					LoadAndRunAction Environment.Value("RootPath") & "TestScript\BIGDS001_02","Action1", oneIteration
'				End If
			Case "STDJC20_EODJOBS" 'Added by Krishna
				If Environment.Value("returncode") = 0 Then
					Call func_reportStatus("Fail","Execution Stopped","Execution Stopped and Unable to Proceed to " & str_currentFunc)
					ExitAction
				End If
'				If Environment.Value("returncode") = 1 Then
					Environment.Value("Job") = Trim(DataTable.Value("Parameter1", "Global"))
					LoadAndRunAction Environment.Value("RootPath") & "TestScript\STDJC20_EOD Dispatch","Action1", oneIteration
'				End If	
			Case "BIGDS021_CUSTOMERSERVICE" 'Added by Krishna
				If Environment.Value("returncode") = 0 Then
					Call func_reportStatus("Fail","Execution Stopped","Execution Stopped and Unable to Proceed to " & str_currentFunc)
					ExitAction
				End If
'				If Environment.Value("returncode") = 1 Then	
					Environment.Value("AccountNumber") = Trim(DataTable.Value("Parameter1"))	
					'msgbox str_path
					'RunAction "Action1 [BIGDS021_CustomerService]", oneIteration
					LoadAndRunAction Environment.Value("RootPath") & "TestScript\BIGDS021_CustomerService","Action1",oneIteration
					
					'LoadAndRunAction "\\..\..\TestScript\BIGDS021_CustomerService","Action1",oneIteration
'				End If
			Case "BIDSC001_ACCOUNT INFORMATION"	'Added by Krishna
				If Environment.Value("returncode") = 0 Then
					Call func_reportStatus("Fail","Execution Stopped","Execution Stopped and Unable to Proceed to " & str_currentFunc)
					ExitAction
				End If
'				If Environment.Value("returncode") = 1 Then	
					Environment.Value("Purpose") = Trim(DataTable.Value("Parameter0"))
					Environment.Value("City") = Trim(DataTable.Value("Parameter1"))
					Environment.Value("State") = Trim(DataTable.Value("Parameter2"))
					Environment.Value("ZIP") = Trim(DataTable.Value("Parameter3"))
					LoadAndRunAction Environment.Value("RootPath") & "TestScript\BIDSC001_ACCOUNT INFORMATION","Action1",oneIteration
					'RunAction "Action1 [BIDSC001_ACCOUNT INFORMATION]", oneIteration
'				End If
			Case "BIDSC015_CONTAINER SELECTION SCREEN"	'Added by Krishna
				If Environment.Value("returncode") = 0 Then
					Call func_reportStatus("Fail","Execution Stopped","Execution Stopped and Unable to Proceed to " & str_currentFunc)
					ExitAction					
				End If
'				If Environment.Value("returncode") = 1 Then	
				    If DataTable.Value("Parameter0")<>"" Then
				    	Environment.Value("Purpose") = Trim(DataTable.Value("Parameter0"))
				    Else
				    	Environment.Value("Purpose") = DataTable.Value("Parameter0")
				    End If
					
					If Environment.Value("FetchAccDetailsFromDB")=False Then
						Environment.Value("Site") = Trim(DataTable.Value("Parameter1"))
						Environment.Value("ContainerGroup") = Trim(DataTable.Value("Parameter2"))
					End If
					
					
					If DataTable.Value("Parameter1")<>"" Then										
						Environment.Value("Site") = Trim(DataTable.Value("Parameter1"))						
					End If
					
					If DataTable.Value("Parameter2")<>"" Then										
						Environment.Value("ContainerGroup") = Trim(DataTable.Value("Parameter2"))					
					End If									
					
					'Environment.Value("Status") = Trim(DataTable.Value("Parameter3"))
					Environment.Value("Action") = Trim(DataTable.Value("Parameter3"))			


					LoadAndRunAction Environment.Value("RootPath") & "TestScript\BIDSC015_CONTAINER SELECTION SCREEN","Action1",oneIteration
					
'				End If
			Case "BIDSC015_RESIDENTIAL SERVICE INFORMATION"
				If Environment.Value("returncode") = 0 Then
					Call func_reportStatus("Fail","Execution Stopped","Execution Stopped")
					Environment.Value("returncode") = 1
					ExitAction					
				End If
'				If Environment.Value("returncode") = 1 Then	
				    If DataTable.Value("Parameter0")<>"" Then
				    	Environment.Value("Purpose") = Trim(DataTable.Value("Parameter0"))
				    Else
				    	Environment.Value("Purpose") = DataTable.Value("Parameter0")
				    End If
					
					Environment.Value("SiteName") = Trim(DataTable.Value("Parameter1"))
					Environment.Value("SiteCity") = Trim(DataTable.Value("Parameter2")) '"LOSANGELES"
					Environment.Value("SiteState") = Trim(DataTable.Value("Parameter3")) '"FL"
					Environment.Value("SiteZIP") = Trim(DataTable.Value("Parameter4")) '"90044-2999"
					LoadAndRunAction Environment.Value("RootPath") & "TestScript\BIDSC015_RESIDENTIAL SERVICE INFORMATION","Action1",oneIteration
					
'				End If
			Case "BIGDS031_SERVICERECORDING"
				If Environment.Value("returncode") = 0 Then
					Call func_reportStatus("Fail","Execution Stopped","Execution Stopped and Unable to Proceed to " & str_currentFunc)
					ExitAction
				End If
'				If Environment.Value("returncode") = 1 Then	
				    If DataTable.Value("Parameter0")<>"" Then
				    	Environment.Value("Purpose") = Trim(DataTable.Value("Parameter0"))
				    Else
				    	Environment.Value("Purpose") = DataTable.Value("Parameter0")
				    End If
					
					Environment.Value("ServiceNumber") = Trim(DataTable.Value("Parameter1"))
					Environment.Value("Route") = DataTable.Value("Parameter2") 
					Environment.Value("Truck") = DataTable.Value("Parameter3")
					Environment.Value("Employee") = DataTable.Value("Parameter4")
					LoadAndRunAction Environment.Value("RootPath") & "TestScript\BIGDS031_ServiceRecording","Action1",oneIteration
					
'				End If
			Case "BIDSC000_MAINTAINCUSTOMERCONTROLS"
				
				If Environment.Value("returncode") = 0 Then
					Call func_reportStatus("Fail","Execution Stopped","Execution Stopped and Unable to Proceed to " & str_currentFunc)
					ExitAction
				End If
'				If Environment.Value("returncode") = 1 Then	
				    If DataTable.Value("Parameter0")<>"" Then
				    	Environment.Value("Purpose") = Trim(DataTable.Value("Parameter0"))
				    Else
				    	Environment.Value("Purpose") = DataTable.Value("Parameter0")
				    End If
				    
				    If DataTable.Value("Parameter1")<>"" Then
				    	Environment.Value("AccountNumber") = Trim(DataTable.Value("Parameter1"))				    
				    End If								
					
					LoadAndRunAction Environment.Value("RootPath") & "TestScript\BIDSC000_MaintainCustomerControls","Action1",oneIteration
					
'				End If
			Case "BIGSC002_SITESELECTIONSCREEN"
				If Environment.Value("returncode") = 0 Then
					Call func_reportStatus("Fail","Execution Stopped","Execution Stopped and Unable to Proceed to " & str_currentFunc)
					ExitAction
				End If
'				If Environment.Value("returncode") = 1 Then	
				    If DataTable.Value("Parameter0")<>"" Then
				    	Environment.Value("Purpose") = Trim(DataTable.Value("Parameter0"))
				    Else
				    	Environment.Value("Purpose") = DataTable.Value("Parameter0")
				    End If
				    
				    If DataTable.Value("Parameter1")<>"" Then
				    	Environment.Value("Site") = Trim(DataTable.Value("Parameter1"))				    
				    End If												
					LoadAndRunAction Environment.Value("RootPath") & "TestScript\BIGSC002_SiteSelectionScreen","Action1",oneIteration
					
'				End If
			Case "BIDSC002_CONTAINER SELECTION SCREEN"
				If Environment.Value("returncode") = 0 Then
					Call func_reportStatus("Fail","Execution Stopped","Execution Stopped and Unable to Proceed to " & str_currentFunc)
					ExitAction
				End If
'				If Environment.Value("returncode") = 1 Then	
				    If DataTable.Value("Parameter0")<>"" Then
				    	Environment.Value("Purpose") = Trim(DataTable.Value("Parameter0"))
				    Else
				    	Environment.Value("Purpose") = DataTable.Value("Parameter0")
				    End If
				    
				    If DataTable.Value("Parameter1")<>"" Then
				    	Environment.Value("ContainerGroup") = Trim(DataTable.Value("Parameter1"))				    
				    End If	
					If DataTable.Value("Parameter2")<>"" Then
				    	Environment.Value("Action") = Trim(DataTable.Value("Parameter2"))				    
				    End If				    
					LoadAndRunAction Environment.Value("RootPath") & "TestScript\BIDSC002_CONTAINER SELECTION SCREEN","Action1",oneIteration					
'				End If
			Case "BIDSC002_CONTAINER RATE INFORMATION"
				If Environment.Value("returncode") = 0 Then
					Call func_reportStatus("Fail","Execution Stopped","Execution Stopped and Unable to Proceed to " & str_currentFunc)
					ExitAction
				End If
'				If Environment.Value("returncode") = 1 Then	
				    If DataTable.Value("Parameter0")<>"" Then
				    	Environment.Value("Purpose") = Trim(DataTable.Value("Parameter0"))
				    Else
				    	Environment.Value("Purpose") = DataTable.Value("Parameter0")
				    End If				    
				    			    
					LoadAndRunAction Environment.Value("RootPath") & "TestScript\BIDSC002_CONTAINER RATE INFORMATION","Action1",oneIteration					
'				End If
			Case "BIDSC002_SITE INFORMATION"
				If Environment.Value("returncode") = 0 Then
					Call func_reportStatus("Fail","Execution Stopped","Execution Stopped and Unable to Proceed to " & str_currentFunc)
					ExitAction
				End If
'				If Environment.Value("returncode") = 1 Then	
				    If DataTable.Value("Parameter0")<>"" Then
				    	Environment.Value("Purpose") = Trim(DataTable.Value("Parameter0"))
				    Else
				    	Environment.Value("Purpose") = DataTable.Value("Parameter0")
				    End If				    
				    If DataTable.Value("Parameter1")<>"" Then
				    	Environment.Value("Site") = Trim(DataTable.Value("Parameter1"))				    
				    End If			    
					LoadAndRunAction Environment.Value("RootPath") & "TestScript\BIDSC002_SITE INFORMATION","Action1",oneIteration					
'				End If
			Case "BIDSC002_CONTAINER INFORMATION"
				If Environment.Value("returncode") = 0 Then
					Call func_reportStatus("Fail","Execution Stopped","Execution Stopped and Unable to Proceed to " & str_currentFunc)
					ExitAction
				End If
'				If Environment.Value("returncode") = 1 Then	
				    If DataTable.Value("Parameter0")<>"" Then
				    	Environment.Value("Purpose") = Trim(DataTable.Value("Parameter0"))
				    Else
				    	Environment.Value("Purpose") = DataTable.Value("Parameter0")
				    End If				    
				    If DataTable.Value("Parameter1")<>"" Then
				    	Environment.Value("ContainerGroup") = Trim(DataTable.Value("Parameter1"))				    
				    End If			    
					LoadAndRunAction Environment.Value("RootPath") & "TestScript\BIDSC002_CONTAINER INFORMATION","Action1",oneIteration					
'				End If
			Case "BIDSC014_CONTAINER SELECTION SCREEN"
				If Environment.Value("returncode") = 0 Then
					Call func_reportStatus("Fail","Execution Stopped","Execution Stopped and Unable to Proceed to " & str_currentFunc)
					ExitAction
				End If
'				If Environment.Value("returncode") = 1 Then	
				    If DataTable.Value("Parameter0")<>"" Then
				    	Environment.Value("Purpose") = Trim(DataTable.Value("Parameter0"))
				    Else
				    	Environment.Value("Purpose") = DataTable.Value("Parameter0")
				    End If	
 					If DataTable.Value("Parameter1")<>"" Then
				    	Environment.Value("Site") = Trim(DataTable.Value("Parameter1"))				    
				    End If				    
				    If DataTable.Value("Parameter2")<>"" Then
				    	Environment.Value("ContainerGroup") = Trim(DataTable.Value("Parameter2"))
							   				    
				    End If	
					If DataTable.Value("Parameter3")<>"" Then
				    	Environment.Value("Action") = Trim(DataTable.Value("Parameter3"))				    
				    End If				    
					LoadAndRunAction Environment.Value("RootPath") & "TestScript\BIDSC014_CONTAINER SELECTION SCREEN","Action1",oneIteration					
'				End If
			Case "BIDSC014R_CONTAINER RATE INFORMATION"
				If Environment.Value("returncode") = 0 Then
					Call func_reportStatus("Fail","Execution Stopped","Execution Stopped and Unable to Proceed to " & str_currentFunc)
					Exit For
				End If
'				If Environment.Value("returncode") = 1 Then	
				    If DataTable.Value("Parameter0")<>"" Then
				    	Environment.Value("Purpose") = Trim(DataTable.Value("Parameter0"))
				    Else
				    	Environment.Value("Purpose") = DataTable.Value("Parameter0")
				    End If	
 									    
				    If DataTable.Value("Parameter1")<>"" Then
				    	Environment.Value("ContainerGroup") = Trim(DataTable.Value("Parameter1"))				    
				    End If	
								    
					LoadAndRunAction Environment.Value("RootPath") & "TestScript\BIDSC014R_CONTAINER RATE INFORMATION","Action1",oneIteration					
'				End If
			Case "BIDSC014_RESIDENTIAL SERVICE INFORMATION"
				If Environment.Value("returncode") = 0 Then
					Call func_reportStatus("Fail","Execution Stopped","Execution Stopped and Unable to Proceed to " & str_currentFunc)
					ExitAction
				End If
'				If Environment.Value("returncode") = 1 Then	
				    If DataTable.Value("Parameter0")<>"" Then
				    	Environment.Value("Purpose") = Trim(DataTable.Value("Parameter0"))
				    Else
				    	Environment.Value("Purpose") = DataTable.Value("Parameter0")
				    End If										    				   	
								    
					LoadAndRunAction Environment.Value("RootPath") & "TestScript\BIDSC014_RESIDENTIAL SERVICE INFORMATION","Action1",oneIteration					
'				End If
			Case "BIDSC015_RESIDENTIAL RATES"
				If Environment.Value("returncode") = 0 Then
					Call func_reportStatus("Fail","Execution Stopped","Execution Stopped and Unable to Proceed to " & str_currentFunc)
					ExitAction
				End If
'				If Environment.Value("returncode") = 1 Then	
				    If DataTable.Value("Parameter0")<>"" Then
				    	Environment.Value("Purpose") = Trim(DataTable.Value("Parameter0"))
				    Else
				    	Environment.Value("Purpose") = DataTable.Value("Parameter0")
				    End If

					If DataTable.Value("Parameter1")<>"" Then
				    	Environment.Value("ContainerGroup") = Trim(DataTable.Value("Parameter1"))				    
				    End If
								    
					LoadAndRunAction Environment.Value("RootPath") & "TestScript\BIDSC015_RESIDENTIAL RATES","Action1",oneIteration					
'				End If
			Case "GETACCOUNT_SITE_CONTAINERGROUP_DB"
				If Environment.Value("returncode") = 0 Then
					Call func_reportStatus("Fail","Execution Stopped","Execution Stopped and Unable to Proceed to " & str_currentFunc)
					ExitAction
				End If
'				If Environment.Value("returncode") = 1 Then	
				    If DataTable.Value("Parameter0")<>"" Then
				    	Environment.Value("Purpose") = Trim(DataTable.Value("Parameter0"))
				    Else
				    	Environment.Value("Purpose") = DataTable.Value("Parameter0")
				    End If
				    If DataTable.Value("Parameter1")<>"" Then
				    	Environment.Value("AccountType") = Trim(DataTable.Value("Parameter1"))				    
				    End If
				    Call func_GetAccountDetails(Environment.Value("AccountType"),Environment.Value("RegionCode"),Environment.Value("DivisionNumber"))
'				End If
			
		End Select 'Select Case UCASE(TRIM(str_currentFunc))
	Next 'For int_currentRow = 1 To int_rowCount
	
			
Services.EndTransaction "StartRun"










'Call func_GetUniqueRecordFromDBData("SYS01","darapch","Sachin8187","SELECT * FROM naeaipdn.P_CUPCST01 WHERE trim(INFOPRO_COMPANY)='847' and trim(INFOPRO_ACOUNT)='91'")
'
'Dim obj_conn
'Call func_ConnectToDB("SYS01","darapch","Sachin8187")
'Function func_ConnectToDB(strSystem,strUID,strPwd)
'	Set obj_conn = CreateObject("ADODB.Connection")	
'	str_connectionString = "Driver={iSeries Access ODBC Driver};System=" & strSystem & ";Uid=" & strUID & ";Pwd=" & strPwd		
'	obj_conn.open str_connectionString
'	If obj_conn.State=1 Then
'		Call func_reportStatus("Pass","Connect DB","Connected to DB Successfully")
'		'func_ConnectToDB = obj_conn
'	Else
'		Call func_reportStatus("Fail","Connect DB","NOT Connected to DB Successfully")
'		Call func_SetReturnCodeToZero()
'	End If
'End Function

'strPubTable = "P_CUPCST01"
'strDivision = "847"
'strAccountNo = "     91"
'blnFoundRecord = VerifyRecord(obj_conn,"SELECT * FROM naeaipdn." & strPubTable & " WHERE trim(INFOPRO_COMPANY)='" & strDivision & "' and trim(INFOPRO_ACOUNT)='" & strAccountNo & "' and ")
'If blnFoundRecord Then
'	Call func_reportStatus("Pass","Verify Record for "
'End If
'Function VerifyRecord(obj_conn,strQuery)	
'	Set obj_resultSet = obj_conn.Execute(strQuery)
'	intRecords = 0	
'	Do While NOT obj_resultSet.EOF
'		intRecords = intRecords + 1	
'		obj_resultSet.MoveNext
'		Exit Do
'	Loop
'	Set obj_resultSet = Nothing
'	msgbox intRecords
'	If intRecords>0 Then			
'		VerifyRecord = True
'	Else		
'		VerifyRecord = False
'	End If			
'End Function


 
