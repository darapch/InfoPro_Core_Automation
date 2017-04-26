Dim obj_WShell
Dim int_CSPOcount, int_rowCount, str_CSPONum
Dim str_selectionScreen, int_selectionCount, arr_BIGDS024Selection, str_BIGDS024Selection
Dim str_selection, str_reason, int_valDelete

Call func_setScreenProperty("BIGDS024")

If (TEWindow("InfoProWindow").TEScreen("BIGDS024").TEField("UnscheduledRequest").Exist(5)) Then
	Call func_reportStatus("PASS", "Unscheduled Request", "Unscheduled Request Screen (BIGDS024) exists")
	
	TEWindow("InfoProWindow").TEScreen("BIGDS024").TeField("URACCT").Set Environment.Value("TrimAccountNumber")
	Call func_SendKey("ENTER")
	
	Call func_SendKey("F7")
	
	arr_BIGDS024Selection = Split(Environment.Value("BIGDS024Selection"), "/")
	Call func_setData(Environment.Value("BIGDS024Selection"), "CSPONUMBER", "SELECTION")
	Call func_setData(Environment.Value("BIGDS024Reason"), "CSPONUMBER", "REASON")
	
	Set obj_WShell = CreateObject("wscript.shell")
	
	int_rowCount = DataTable.Getsheet("CSPONUMBER").GetRowCount
	For int_CSPOcount = 1 To int_rowCount
		DataTable.GetSheet("CSPONUMBER").SetCurrentRow int_CSPOcount
		str_CSPONum = DataTable("URURNO","CSPONUMBER")
		TEWindow("InfoProWindow").TEScreen("BIGDS024").TeField("CSPONum").SetTOProperty "text", str_CSPONum
		
		If (TEWindow("InfoProWindow").TEScreen("BIGDS024").TeField("CSPONum").Exist(5)) Then
			 Call func_reportStatus("PASS", "Unscheduled Request", str_CSPONum & "exists")
			Else
			 Call func_reportFailureScreenshot()
			 Call func_reportStatus("Warning", "Unscheduled Request", str_CSPONum & "does not exist")
		 End If 'If (TEWindow("InfoProWindow").TEScreen("BIGDS024").TeField("CSPONum").Exist(5)) Then
		 
		TEWindow("InfoProWindow").TEScreen("BIGDS024").TeField("CSPONum").SetCursorPos
		
		str_selection = Trim(DataTable("SELECTION","CSPONUMBER"))
		str_reason = Trim(DataTable("REASON","CSPONUMBER"))
		
		If (str_selection <> "") Then
			If (str_selection = "D") Then
				str_selectionScreen = "DeleteTransaction"
			ElseIf str_selection = "C" Then
				str_selectionScreen = "ChangeTransaction"
			End If 'If (str_selection = "D") Then
			
			obj_WShell.Sendkeys "+{TAB}"
			obj_WShell.Sendkeys str_selection
			Wait(2)
			obj_WShell.Sendkeys "{ENTER}"
	
			If (TEWindow("InfoProWindow").TEScreen("BIGDS024").TEField(str_selectionScreen).Exist(5)) Then
				Call func_reportStatus("PASS", str_selectionScreen, str_selectionScreen & " Screen (BIGDS024) exists")
				TEWindow("InfoProWindow").TEScreen("BIGDS024").TEField("DeleteReason"). Set str_reason
				Call func_SendKey("ENTER")
			Else
				Call func_reportStatus("Warning", str_selectionScreen, str_selectionScreen & " Screen (BIGDS024) does not exist")
			End If 'If (TEWindow("InfoProWindow").TEScreen("BIGDS024").TEField("DeleteTransaction").Exist(5)) Then
			
			If (str_selection = "D") Then
					obj_WShell.Sendkeys "{F5}"
					If (TEWindow("InfoProWindow").TEScreen("BIGDS024").TeField("CSPONum").Exist) Then
						Call func_reportStatus("Warning", "BIGDS024", str_CSPONum & " exist after deletion in Screen (BIGDS024)")
					Else
						Call func_reportStatus("PASS", "BIGDS024", str_CSPONum & " deleted in screen")
						str_delCSPOQuery = "SELECT URSCHD as URSCHD FROM CUFILE.BIPUR WHERE URACCT = " & Environment.Value("AccountNumber")
						str_delCSPOQuery = str_delCSPOQuery & " AND URCOMP = " & Environment.Value("DivisionNumber") & " AND URURNO = "& str_CSPONum
						int_valDelete = func_ValidateDelete(str_delCSPOQuery)
						
						If (int_valDelete = 1) Then
							Call func_reportStatus("PASS", "BIGDS024", str_CSPONum & " deleted in database")
						Else
							Call func_reportStatus("Warning", "BIGDS024", str_CSPONum & " is not deleted in database")
						End If 'If (int_valDelete = 1) Then
						
					End If 'If (TEWindow("InfoProWindow").TEScreen("BIGDS024").TeField("CSPONum").Exist) Then
			End If 'If (str_selection = "D") Then
		End If
	Next 'For int_CSPOcount = 1 To int_rowCount
	
	Set obj_WShell = NOTHING
Else
	Call func_reportFailureScreenshot()
	Call func_reportStatus("FAIL", "Unscheduled Request", "Unscheduled Request Screen (BIGDS024) does not exist")
End If 'If (TEWindow("InfoProWindow").TEScreen("BIGDS024").TEField("UnscheduledRequest").Exist(5)) Then
