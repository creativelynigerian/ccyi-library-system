function doGet(e){

var action = e.parameter.action;

if(action=="books"){
return getBooks();
}

if(action=="loans"){
return getLoans();
}

return ContentService
.createTextOutput(
JSON.stringify({
status:"API Running"
})
)
.setMimeType(
ContentService.MimeType.JSON
);

}

function doPost(e){

var data =
JSON.parse(
e.postData.contents
);

var action =
data.action;

if(action=="addBook"){
return addBook(data);
}

if(action=="loanBook"){
return loanBook(data);
}

if(action=="returnBook"){
return returnBook(data);
}

}

function getBooks(){

var sheet =
SpreadsheetApp
.getActive()
.getSheetByName("Books");

var data =
sheet.getDataRange()
.getValues();

return ContentService
.createTextOutput(
JSON.stringify(data)
)
.setMimeType(
ContentService.MimeType.JSON
);

}

function getLoans(){

var sheet =
SpreadsheetApp
.getActive()
.getSheetByName("Loans");

var data =
sheet.getDataRange()
.getValues();

return ContentService
.createTextOutput(
JSON.stringify(data)
)
.setMimeType(
ContentService.MimeType.JSON
);

}

function addBook(data){

var sheet =
SpreadsheetApp
.getActive()
.getSheetByName("Books");

sheet.appendRow([

Date.now(),

data.title,

data.author,

data.isbn,

data.category,

data.quantity

]);

return ContentService
.createTextOutput(
JSON.stringify({
success:true
})
);

}

function loanBook(data){

var sheet =
SpreadsheetApp
.getActive()
.getSheetByName("Loans");

sheet.appendRow([

Date.now(),

data.borrowerName,

data.borrowerPhone,

data.borrowerEmail,

data.bookId,

data.bookTitle,

data.borrowDate,

data.dueDate,

"Borrowed"

]);

return ContentService
.createTextOutput(
JSON.stringify({
success:true
})
);

}
