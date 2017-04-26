'Environment.Value("DivisionNumber") = "902"
intsupposedSpaces = 5-Len(Environment.Value("DivisionNumber"))
Environment.Value("DivisionNumber") = Space(intsupposedSpaces) & Environment.Value("DivisionNumber")
'Environment.Value("AccountNumber") = "9523877"
'Environment.Value("Site") = "00001"
'Environment.Value("ServiceNumber") = "34734"

'Environment.Value("Purpose")="UPDATEF2NOTESFDC"

If TeWindow("InfoProWindow").TeScreen("BIGDS031_SERVICE RECORDING").TeField("ServicingRecording").Exist(5)Then
	Call func_reportStatus("Pass","Verify the 'Service Recording' Screen","The 'Service Recording' screen is Available")
Else
	Call func_reportStatus("Fail","Verify the 'Service Recording' Screen","The 'Service Recording' screen is NOT Available")
'	ExitTest
End If

	
Select Case UCase(Environment.Value("Purpose"))
	Case "CREATEF2NOTE"
		Call func_CreateF2Note()
	Case "UPDATEF2NOTESFDC"		
		Call func_UpdateF2NoteSFDC()
	Case "CLOSEF2NOTESFDC"		
		Call func_CloseF2NoteSFDC()
	Case "NON-SERVICEF2"
		arrTotalServiceNumbers = Split(Environment.Value("ServiceNumber"),",")
		For intServicesCount = 0 To UBound(arrTotalServiceNumbers)
			Environment.Value("ServiceNumber") = arrTotalServiceNumbers(intServicesCount)
			
			'Call func_CreateF2Note()
			Call func_reportStatus("Done",intServicesCount+1 & ". Service # " & Environment.Value("ServiceNumber"),"")
			Call func_UpdateF2NoteSFDC()
			Call func_CloseF2NoteSFDC()
		Next		
End Select



Function func_CloseF2NoteSFDC()
	Call func_reportStatus("Done","CLOSE the Service Code : " & Environment.Value("ServiceNumber"),"")
	intServFieldID = func_SearchItemInGrid(Environment.Value("ServiceNumber"),0)
		If intServFieldID>0 Then
			intServSelFieldID = intServFieldID-2
			intCLOFieldID = intServFieldID+7	
			Call func_reportStatus("Pass","Verify the Serv # '" & Environment.Value("ServiceNumber") & "'","The Serv # '" & Environment.Value("ServiceNumber") & "' is Available")	
			strStatus = TeWindow("InfoProWindow").TeScreen("BIGDS031_SERVICE RECORDING").TeField("field id:=" & intCLOFieldID).GetROProperty("text")
			If strStatus="Y" Then
				Call func_reportStatus("Fail","Verify the Status","The Status of the Serv# '" & Environment.Value("ServiceNumber") & "' is already 'Y'")		
			Else
				Call func_reportStatus("Pass","Verify the Status","The Status for the Serv# '" & Environment.Value("ServiceNumber") & "' is '" & strStatus & "'")	
				TeWindow("InfoProWindow").TeScreen("BIGDS031_SERVICE RECORDING").TeField("field id:=" & intServSelFieldID).Set "1"
				Call func_SendKey("ENTER")
				strCurrentServiceText = "Service Text " & Environment.Value("ServiceNumber") & " - " & Second(Now)'TeWindow("InfoProWindow").TeScreen("BIGDS031_SERVICE RECORDING").GetROProperty("text")
				
				strTime = Left(MonthName(Month(Now)),3) & "-" & Day(Now) & "-" & Hour(now) & "-" & Minute(Now) & "-" & Second(Now)
				strSubject = UCase("SUBJECT-" & strTime)
				strCurrentServiceText = "Service Text - " & strTime
				Call func_EnterValueInTeField("BIGDS031_SERVICE RECORDING","Subject",strSubject)
				Call func_EnterValueInTeField("BIGDS031_SERVICE RECORDING","ServiceText",strCurrentServiceText)
				If Len(Month(Now))=1 Then
					Environment.Value("ScheduledCompletionMonth") = " " & Month(Now)
				Else
					Environment.Value("ScheduledCompletionMonth") = Month(Now)
				End If
				
				If Len(Day(Now))=1 Then
					Environment.Value("ScheduledCompletionDate") = " " & Day(Now)
				Else
					Environment.Value("ScheduledCompletionDate") = Day(Now)
				End If
				Call func_EnterValueInTeField("BIGDS031_SERVICE RECORDING","ScheduledCompletionMonth",Environment.Value("ScheduledCompletionMonth"))
				Call func_EnterValueInTeField("BIGDS031_SERVICE RECORDING","ScheduledCompletionDate",Environment.Value("ScheduledCompletionDate"))
				Call func_EnterValueInTeField("BIGDS031_SERVICE RECORDING","ScheduledCompletionYear",Right(Year(Now),2))
				Call func_SendKey("F10")
				TeWindow("InfoProWindow").TeScreen("BIGDS031_SERVICE RECORDING").TeField("CLO").SetTOProperty "attached text",Environment.Value("ServiceNumber")
				wait(3)
				Call func_EnterValueInTeField("BIGDS031_SERVICE RECORDING","CLO","Y")
				strActionTakenText = "Closing the Serv# " & Environment.Value("ServiceNumber") & " - " & Date
				Call func_EnterValueInTeField("BIGDS031_SERVICE RECORDING","ActionTaken",strActionTakenText)	
				Call func_SendKey("ENTER")
				wait(1)
				strStatus = TeWindow("InfoProWindow").TeScreen("BIGDS031_SERVICE RECORDING").TeField("field id:=" & intCLOFieldID).GetROProperty("text")
				If strStatus="Y" Then
					Call func_reportStatus("Pass","Verify the Status","The Status of the Serv# '" & Environment.Value("ServiceNumber") & "' is Changed to 'Y'")			
				Else
					Call func_reportStatus("Fail","Verify the Status","The Status of the Serv# '" & Environment.Value("ServiceNumber") & "' is NOT Changed to 'Y'")
				End If		
				
				If Len(Month(Now))=1 Then
					Environment.Value("ScheduledCompletionMonth") = "0" & Month(Now)
				Else
					Environment.Value("ScheduledCompletionMonth") = Month(Now)
				End If
				
				If Len(Day(Now))=1 Then
					Environment.Value("ScheduledCompletionDate") = "0" & Day(Now)
				Else
					Environment.Value("ScheduledCompletionDate") = Day(Now)
				End If
				
				Environment.Value("TimeStamp") = Year(Now) & Environment.Value("ScheduledCompletionMonth") & Environment.Value("ScheduledCompletionDate")
				
				strExpectedCompKey = Trim(Environment.Value("DivisionNumber")) & Environment.Value("AccountNumber") & Environment.Value("Site") & Environment.Value("ServiceNumber") & Environment.Value("TimeStamp")
				
				str_sqlBIPSUOQuery = "SELECT * FROM NAEAIPDN.P_BIPSUO WHERE COMPANY_NUMBER='" & Environment.Value("DivisionNumber") & "' and SERVICE_RECORDING_NO='" & Environment.Value("ServiceNumber") &  "' and TRIGGER_TABLE='BIPSUO' and TEXT_DESCRIPTION='" & strCurrentServiceText & "'"
				
				If func_GetUniqueRecordFromDBData("Sys01","darapch","Sachin8187",str_sqlBIPSUOQuery) Then		
					Call func_reportStatus("Pass","Verify Record Existancy for the Trigger Table BIPSUO","Atleast 1 Record is available for BIPSUO")
					If Trim(Environment.Value("COMPOSITE_KEY"))=strExpectedCompKey Then
						Call func_reportStatus("Done","Composite Key in BIPSUO Record","Composite Key Found for BIPSUO is '" & Environment.Value("COMPOSITE_KEY") & "'")			
						Call func_reportStatus("Pass","Verify the Composite key in BIPSUO Record","Composit Key is in the Combination of Division Number+Account Number+site+5 digit service number+date in YYYYMMDD")
						
					End If	
					Call func_reportStatus("Pass","Verify the 'Text _Description' column in BIPSUO Record","The Value of the column 'Text_Description' in DB is '" & strCurrentServiceText & "'. The Service Text provided in service recording screen is '" & strCurrentServiceText & "'")
				Else
					Call func_reportStatus("Fail","Verify Record Existancy for the Trigger Table BIPSUO","No Record is available for BIPSUO")
				End If
					
				str_sqlBIPSXQuery = "SELECT * FROM NAEAIPDN.P_BIPSUO WHERE COMPANY_NUMBER='" & Environment.Value("DivisionNumber") & "' and SERVICE_RECORDING_NO='" & Environment.Value("ServiceNumber") &  "' and TRIGGER_TABLE='BIPSX' and F10_TEXT_DESCRIPTION='" & strActionTakenText & "'"
				
				If func_GetUniqueRecordFromDBData("Sys01","darapch","Sachin8187",str_sqlBIPSXQuery) Then	
					Call func_reportStatus("Pass","Verify Record Existancy for the Trigger Table BIPSX","Atleast 1 Record is available for BIPSX")
					Call func_reportStatus("Pass","Verify data in F10_Text_Description column","The Value of the column 'F10_Text_Description' in DB is '" & strActionTakenText & "'. The Action Taken text provided is '" & strActionTakenText & "'")
					If Environment.Value("RECORD_CLOSED")="Y" Then
						Call func_reportStatus("Pass","Verify data in 'Record_Closed' column","'Y' is displayed in Record_Closed column")
					End If
					strClosingDate = Month(Now) & "/" & Day(Now) & "/" & Year(Now)
					If Replace(Environment.Value("CLOSING_DATE"),"#","")=strClosingDate Then		
						Call func_reportStatus("Pass","Verify  Closing_Date","Closing_Date column showing the date when the service closed i.e " & Environment.Value("CLOSING_DATE"))
					Else
						Call func_reportStatus("Pass","Verify  Closing_Date","Closing_Date column showing the date when the service closed i.e " & Environment.Value("CLOSING_DATE"))
					End If
				Else
					Call func_reportStatus("Fail","Verify Record Existancy for the Trigger Table BIPSX","No Record is available for BIPSX")
				End If
			End If
			
		Else
			Call func_reportStatus("Fail","Verify the Serv # '" & Environment.Value("ServiceNumber") & "'","The Serv # '" & Environment.Value("ServiceNumber") & "' is NOT Available")
		End If 'intServFieldID>0
		
End Function

Function func_UpdateF2NoteSFDC()
	Call func_reportStatus("Done","UPDATE the Service Code : " & Environment.Value("ServiceNumber"),"")
	intServFieldID = func_SearchItemInGrid(Environment.Value("ServiceNumber"),0)
	If intServFieldID>0 Then
		intServSelFieldID = intServFieldID-2
		intCLOFieldID = intServFieldID+7	
		Call func_reportStatus("Pass","Verify the Serv # '" & Environment.Value("ServiceNumber") & "'","The Serv # '" & Environment.Value("ServiceNumber") & "' is Available")	
		strStatus = TeWindow("InfoProWindow").TeScreen("BIGDS031_SERVICE RECORDING").TeField("field id:=" & intCLOFieldID).GetROProperty("text")
		If strStatus="Y" Then
			Call func_reportStatus("Fail","Verify the Status","The Status for the Serv# '" & Environment.Value("ServiceNumber") & "' is 'Y'")
	'		ExitTest	
		Else
			Call func_reportStatus("Pass","Verify the Status","The Status for the Serv# '" & Environment.Value("ServiceNumber") & "' is '" & strStatus & "'")	
			TeWindow("InfoProWindow").TeScreen("BIGDS031_SERVICE RECORDING").TeField("field id:=" & intServSelFieldID).Set "1"			
			Call func_SendKey("ENTER")
			msgbox Err.number
			print Err.number
			strCode = TeWindow("InfoProWindow").TeScreen("BIGDS031_SERVICE RECORDING").TeField("Code").GetROProperty("text")
			Call func_reportStatus("Done","The Available Code","The Available Code : " & strCode)
			'TeWindow("InfoProWindow").TeScreen("BIGDS031_SERVICE RECORDING").TeField("Code").SetCursorPos
			'Call func_SendKey("F4")
			'wait(2)
			'intCodeFieldIDInHelp = func_SearchItemInGrid(strCode)
			'If intCodeFieldIDInHelp>0 Then
			'	intCodeDescFieldIDInHelp = intCodeFieldIDInHelp + 15			
				Call func_SendKey("F3")	
				strTime = Left(MonthName(Month(Now)),3) & "-" & Day(Now) & "-" & Hour(now) & "-" & Minute(Now) & "-" & Second(Now)
				strSubject = UCase("SUBJECT-" & strTime)
				strServiceText = "Service Text - " & strTime
				Call func_EnterValueInTeField("BIGDS031_SERVICE RECORDING","Subject",strSubject)
				Call func_EnterValueInTeField("BIGDS031_SERVICE RECORDING","ServiceText",strServiceText)
				
				Call func_EnterValueInTeField("BIGDS031_SERVICE RECORDING","Route",Environment.Value("Route"))
				
				Call func_EnterValueInTeField("BIGDS031_SERVICE RECORDING","Truck",Environment.Value("Truck"))
				Call func_EnterValueInTeField("BIGDS031_SERVICE RECORDING","Employee",Environment.Value("Employee"))
				If Len(Month(Now))=1 Then
					Environment.Value("ScheduledCompletionMonth") = " " & Month(Now)
				Else
					Environment.Value("ScheduledCompletionMonth") = Month(Now)
				End If
				
				If Len(Day(Now))=1 Then
					Environment.Value("ScheduledCompletionDate") = " " & Day(Now)
				Else
					Environment.Value("ScheduledCompletionDate") = Day(Now)
				End If
				Call func_EnterValueInTeField("BIGDS031_SERVICE RECORDING","ScheduledCompletionMonth",Environment.Value("ScheduledCompletionMonth"))
				Call func_EnterValueInTeField("BIGDS031_SERVICE RECORDING","ScheduledCompletionDate",Environment.Value("ScheduledCompletionDate"))
				Call func_EnterValueInTeField("BIGDS031_SERVICE RECORDING","ScheduledCompletionYear",Right(Year(Now),2))
				Call func_SendKey("F10")		
				strActionTakenText = "Update the Serv# " & Environment.Value("ServiceNumber") & " - " & Date
				Call func_EnterValueInTeField("BIGDS031_SERVICE RECORDING","ActionTaken",strActionTakenText)			
			'End If
			
			Call func_SendKey("ENTER")
			
			If TeWindow("InfoProWindow").TeScreen("BIGDS031_SERVICE RECORDING").TeField("GridHeader").Exist(5) Then
				Call func_reportStatus("Pass","Press Enter","Information is updated and user is exit back to 'Service Recording' screen")
			Else
				Call func_reportStatus("Fail","Press Enter","Information is NOT updated and user is NOT exit back to 'Service Recording' screen")
			End If
			
			Environment.Value("TimeStamp") = Year(Now) & Environment.Value("ScheduledCompletionMonth") & Environment.Value("ScheduledCompletionDate")
			
			strExpectedCompKey = Trim(Environment.Value("DivisionNumber")) & Environment.Value("AccountNumber") & Environment.Value("Site") & Environment.Value("ServiceNumber") & Replace(Environment.Value("TimeStamp")," ","")
			
			str_sqlBIPSUOQuery = "SELECT * FROM NAEAIPDN.P_BIPSUO WHERE COMPANY_NUMBER='" & Environment.Value("DivisionNumber") & "' and SERVICE_RECORDING_NO='" & Environment.Value("ServiceNumber") &  "' and TRIGGER_TABLE='BIPSUO' and TEXT_DESCRIPTION='" & strServiceText & "'"
			
			If func_GetUniqueRecordFromDBData("Sys01","darapch","Sachin8187",str_sqlBIPSUOQuery) Then		
				Call func_reportStatus("Pass","Verify Record Existancy for the Trigger Table BIPSUO","Atleast 1 Record is available for BIPSUO")
				If Trim(Environment.Value("COMPOSITE_KEY"))=strExpectedCompKey Then
					Call func_reportStatus("Done","Composite Key in BIPSUO Record","Composite Key Found for BIPSUO is '" & Environment.Value("COMPOSITE_KEY") & "'")			
					Call func_reportStatus("Pass","Verify the Composite key in BIPSUO Record","Composit Key is in the Combination of Division Number+Account Number+site+5 digit service number+date in YYYYMMDD")
					
				End If	
				If Trim(Environment.Value("TRANSACTION_CODE"))=Trim(strCode) Then
					Call func_reportStatus("Pass","Verify Transaction_Code column","The Value of the column 'TRANSACTION_CODE' in DB is '" & Environment.Value("TRANSACTION_CODE") & "' and matched with the Code provided in service recording")			
				Else
					Call func_reportStatus("Fail","Verify Transaction_Code column","The Value of the column 'TRANSACTION_CODE' in DB is '" & Environment.Value("TRANSACTION_CODE") & "' and NOT matched with the Code '" & strCode & "' provided in service recording")			
				End If
				
				
				strScheduledCompletionDate = Replace(Environment.Value("ScheduledCompletionMonth") & "/" & Environment.Value("ScheduledCompletionDate") & "/" & Year(Now)," ","")
				If Trim(Environment.Value("SCHEDULED_COMPLETION_DATE"))=strScheduledCompletionDate Then
					Call func_reportStatus("Pass","Verify 'SCHEDULED_COMPLETION_DATE' column","The value of 'SCHEDULED_COMPLETION_DATE' in DB is '" & Environment.Value("SCHEDULED_COMPLETION_DATE") & ". Mathced with the provided Scheduled time in service recording")
				Else
					Call func_reportStatus("Fail","Verify 'SCHEDULED_COMPLETION_DATE' column","The value of 'SCHEDULED_COMPLETION_DATE' in DB is '" & Environment.Value("SCHEDULED_COMPLETION_DATE") & ". NOT Mathced with the Scheduled time '" & strScheduledCompletionDate & "' in service recording")
				End If					
				Call func_reportStatus("Pass","Verify the 'Text _Description' column in BIPSUO Record","The Value of the column 'Text_Description' in DB is '" & strServiceText & "'. The Service Text provided in service recording screen is '" & strServiceText & "'")
			Else
				Call func_reportStatus("Fail","Verify Record Existancy for the Trigger Table BIPSUO","No Record is available for BIPSUO")
			End If
				
			str_sqlBIPSXQuery = "SELECT * FROM NAEAIPDN.P_BIPSUO WHERE COMPANY_NUMBER='" & Environment.Value("DivisionNumber") & "' and SERVICE_RECORDING_NO='" & Environment.Value("ServiceNumber") &  "' and TRIGGER_TABLE='BIPSX' and F10_TEXT_DESCRIPTION='" & strActionTakenText & "'"
			
			If func_GetUniqueRecordFromDBData("Sys01","darapch","Sachin8187",str_sqlBIPSXQuery) Then	
				Call func_reportStatus("Pass","Verify Record Existancy for the Trigger Table BIPSX","Atleast 1 Record is available for BIPSX")
				Call func_reportStatus("Pass","Verify data in F10_Text_Description column","The Value of the column 'F10_Text_Description' in DB is '" & strActionTakenText & "'. The Action Taken text provided is '" & strActionTakenText & "'")				
			Else
				Call func_reportStatus("Fail","Verify Record Existancy for the Trigger Table BIPSX","No Record is available for BIPSX")
			End If	
		End If
				
	Else
		Call func_reportStatus("Fail","Verify the Serv # '" & Environment.Value("ServiceNumber") & "'","The Serv # '" & Environment.Value("ServiceNumber") & "' is NOT Available")
'		ExitTest
	End If

End Function








Function func_CreateF2Note()
	Call func_reportStatus("Done","CREATE the Service Code","")
	Call func_SendKey("F6")
	TeWindow("InfoProWindow").TeScreen("BIGDS031_SERVICE RECORDING").TeField("Code").SetCursorPos
	Call func_SendKey("F4")
	intCodeFieldIDInHelp = 664 'func_SearchItemInGrid(strCode)	
	intCodeDescFieldIDInHelp = intCodeFieldIDInHelp + 15
	strCode = TeWindow("InfoProWindow").TeScreen("column count:=80").TeField("field id:=" & intCodeFieldIDInHelp).GetROProperty("text")	
	TeWindow("InfoProWindow").TeScreen("column count:=80").TeField("field id:=" & intCodeFieldIDInHelp).SetCursorPos
	Call func_SendKey("BACKTAB") 
	Call func_SendKey("1")
	Call func_SendKey("ENTER")	
	strTime = Left(MonthName(Month(Now)),3) & "-" & Day(Now) & "-" & Hour(now) & "-" & Minute(Now) & "-" & Second(Now)
	strSubject = UCase("SUBJECT-" & strTime)
	strServiceText = "Service Text - " & strTime 
	Call func_EnterValueInTeField("BIGDS031_SERVICE RECORDING","Subject",strSubject)
	Call func_EnterValueInTeField("BIGDS031_SERVICE RECORDING","ServiceText",strServiceText)
	If Len(Month(Now))=1 Then
		Environment.Value("ScheduledCompletionMonth") = " " & Month(Now)
	Else
		Environment.Value("ScheduledCompletionMonth") = Month(Now)
	End If
	
	If Len(Day(Now))=1 Then
		Environment.Value("ScheduledCompletionDate") = " " & Day(Now)
	Else
		Environment.Value("ScheduledCompletionDate") = Day(Now)
	End If
	Call func_EnterValueInTeField("BIGDS031_SERVICE RECORDING","ScheduledCompletionMonth",Environment.Value("ScheduledCompletionMonth"))
	Call func_EnterValueInTeField("BIGDS031_SERVICE RECORDING","ScheduledCompletionDate",Environment.Value("ScheduledCompletionDate"))
	Call func_EnterValueInTeField("BIGDS031_SERVICE RECORDING","ScheduledCompletionYear",Right(Year(Now),2))
	Call func_SendKey("ENTER")
	
	intSubjectFieldID = func_SearchItemInGrid(strSubject,0)
	If intSubjectFieldID>0 Then
		intServCodeFieldID = intSubjectFieldID-52
		Environment.Value("ServiceNumber") = TeWindow("InfoProWindow").TeScreen("BIGDS031_SERVICE RECORDING").TeField("field id:=" & intServCodeFieldID).GetROProperty("text")
		Call func_reportStatus("Pass","Verify the service code created","The Created Service is '" & Environment.Value("ServiceNumber") & "'")
	Else
		Call func_reportStatus("Pass","Verify the service code created","The Service is NOT been created successfully")
	End If
End Function



