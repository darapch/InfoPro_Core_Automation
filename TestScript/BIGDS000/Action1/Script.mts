Dim int_columnCount, int_columnNumber, int_rowCount, int_rowNumber, int_dispatchDateFlag
Dim obj_dateDispatchProperty
Dim obj_WShell
Dim str_date, arr_date

Call func_setScreenProperty("BIGDS000")

If TEWindow("InfoProWindow").TEScreen("BIGDS000").TEField("SelDateDispatch").Exist(5) Then
	Call func_reportStatus("PASS", "Select Date for Dispatch screen exists", "")
	
	Set obj_WShell = CreateObject("wscript.shell")
	Set obj_dateDispatchProperty = TEWindow("InfoProWindow").TEScreen("BIGDS000").TeField("Date")
	
	int_dispatchDateFlag = 0
	
	str_date = Environment.Value("RoutingDate")
	arr_date = Split(str_date, "/")
	str_date = arr_date(0) & "/" & arr_date(1) & "/" & Right(arr_date(2), 2)
	
	For int_columnCount = 1 To 4
		If int_columnCount = 1 Then
			int_columnNumber = 10
		Else
			int_columnNumber = int_columnNumber + 20
		End If 'If int_columnCount = 1 Then

		For int_rowCount = 1 To 5
			If int_rowCount = 1 Then
				int_rowNumber = 5
			Else
				int_rowNumber = int_rowNumber + 1
			End If 'If int_rowCount = 1 Then
			
			obj_dateDispatchProperty.SetTOProperty "start row", int_rowNumber
			obj_dateDispatchProperty.SetTOProperty "start column", int_columnNumber
			obj_dateDispatchProperty.SetTOProperty "text", str_date
			
			If obj_dateDispatchProperty.Exist(2) Then
				obj_dateDispatchProperty.SetCursorPos
				obj_WShell.Sendkeys "+{TAB}"
				obj_WShell.Sendkeys "S"
				int_dispatchDateFlag = 1
				Exit For
			End If
		Next 'For int_rowCount = 1 To 5
			If (int_dispatchDateFlag = 1) Then
				Exit For
			End If 'If (int_dispatchDateFlag = 1) Then
			
		If ((int_columnCount = 4) And (TEWindow("InfoProWindow").TEScreen("BIGDS000").TeField("NextPage").Exist(2))) Then
			obj_WShell.Sendkeys "{PGDN}"
			int_columnCount = 0
			int_rowCount = 1
		End If 'If ((int_columnCount = 4) And (TEWindow("InfoProWindow").TEScreen("BIGDS000").TeField("NextPage").Exist(2))) Then
	Next 'For int_columnCount = 1 To 4
	
	If (int_dispatchDateFlag = 1) Then
		obj_WShell.Sendkeys "{ENTER}"
		Call func_reportStatus("PASS", "Dispatch Date : " & str_date & " , selected", "")
		
		If (TEWindow("InfoProWindow").TEScreen("TimeEditScreen").TeField("EditTime").Exist(5)) Then
			Call func_reportStatus("PASS", "Edit Time Option screen exists", "")
			TEWindow("InfoProWindow").TEScreen("TimeEditScreen").TeField("TimeOption").Set "N"
			obj_WShell.Sendkeys "{ENTER}"
		Else
			Call func_reportFailureScreenshot()
			Call func_reportStatus("FAIL", "Edit Time Option screen does not exists", "")
		End If 'If (TEWindow("InfoProWindow").TEScreen("TimeEditScreen").TeField("EditTime").Exist(5)) Then
		
	Else
		Call func_reportFailureScreenshot()
		Call func_reportStatus("FAIL", "Dispatch Date : " & str_date & " , not present on the screen", "")
	End If 'If (int_dispatchDateFlag = 1) Then
	
	Set obj_WShell = Nothing
	Set obj_dateDispatchProperty = Nothing
	
Else
	Call func_reportFailureScreenshot()
	Call func_reportStatus("FAIL", "Select Date for Dispatch screen does not exists", "")
End If 'If TEWindow("InfoProWindow").TEScreen("BIGDS000").TEField("SelDateDispatch").Exist(5) Then
