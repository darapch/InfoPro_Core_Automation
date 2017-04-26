Environment.Value("RootPath") = Split(Environment.Value("TestDir"),"TestScript")(0)

str_ControlSheetPath = Environment.Value("RootPath") & "DataSheet\ControlSheet.xls"

ExecuteFile Environment.Value("RootPath") & "Config\Configuration.vbs"

Set objExcelDB = CreateObject("ADODB.Connection")
objExcelDB.Open "Driver={Microsoft Excel Driver (*.xls)};DBQ=" & Environment.Value("RootPath") & "DataSheet\ControlSheet.xls"
Set objRecordSetSuite = CreateObject("ADODB.RecordSet")
objRecordSetSuite.Open "select * from [ExecutionFlow$] where Execute='Y'",objExcelDB
intTSRecords = -1


While NOT objRecordSetSuite.EOF	
	ReDim Preserve arrTestSuits(intTSRecords+1)
	strCurrentTestSuite = objRecordSetSuite("TestSuiteName")
	arrTestSuits(intTSRecords+1) = strCurrentTestSuite	
	intTSRecords = intTSRecords + 1
	objRecordSetSuite.MoveNext
Wend

If intTSRecords<0 Then
	Call func_reportStatus("Fail","No Test Suits are available","No Test Suits are available")
	ExitTest
End If

For intTestSuite = 0 To UBound(arrTestSuits)
	Environment.Value("TestSuitName") = arrTestSuits(intTestSuite)
	Environment.Value("CurrentTestDataSheet") = ""
	Call CreateTestSetReport(Environment.Value("RootPath") & "\Reports",Environment.Value("TestSuitName"))
	Set objExcelDB = CreateObject("ADODB.Connection")
	objExcelDB.Open "Driver={Microsoft Excel Driver (*.xls)};DBQ=" & Environment.Value("RootPath") & "DataSheet\ControlSheet.xls"
	Set objRecordSet = CreateObject("ADODB.RecordSet")
	objRecordSet.Open "select * from [" & Environment.Value("TestSuitName") & "$] where Execute='Y'",objExcelDB
	intRecords = -1
	
	'To Get the Test Cases
	While NOT objRecordSet.EOF	
		ReDim Preserve arrTestCases(intRecords+1)
		strCurrentTestCase = objRecordSet("TestCase")
		arrTestCases(intRecords+1) = strCurrentTestCase	
		intRecords = intRecords + 1
		objRecordSet.MoveNext
	Wend
	'END : To Get the Test Cases
	
	If intRecords<0 Then
		Exit For
	End If
	
	'To Iterate the Test Cases
	For intTestCase = 0 To UBound(arrTestCases)		
		Environment.Value("Result") = ""
		Environment.Value("CurrentTestDataSheet") = arrTestCases(intTestCase)
		LoadAndRunAction Environment.Value("RootPath") & "TestScript\Driver_Repaired","Action1",oneIteration
		Environment.Value("FetchAccDetailsFromDB")=False
		Environment.Value("returncode") = 1
		If InStr(UCase(Environment.Value("Result")),"FAIL")>0 Then
			Call AddTestSetRow(Environment.Value("CurrentTestDataSheet"),"Fail",Environment.Value("HTMLResultFilePath"))
		ElseIf InStr(UCase(Environment.Value("Result")),"PASS")>0 Then
			Call AddTestSetRow(Environment.Value("CurrentTestDataSheet"),"Pass",Environment.Value("HTMLResultFilePath"))	
		End If	
	Next
	'END : To Iterate the Test Cases
Next
