let books=[];
function addBook(){
 books.push({
  title:document.getElementById('title').value,
  author:document.getElementById('author').value
 });
 render();
}
function render(){
 document.getElementById('books').innerHTML=books.map(b=>`<tr><td>${b.title}</td><td>${b.author}</td></tr>`).join('');
}