const pool = require('./_dbPool');
const getDate = (d) => `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
const getTime = (d) => `${d.getHours()}-${d.getMinutes()}-${d.getSeconds()}`;
const getDateTime = (d) => getDate(d) + ' ' + getTime(d);

const list = (req, res)=>{
  let sql = `SELECT idproducts, name, quantity, DATE_FORMAT(registrationDate, '%Y-%m-%d') AS date, seller From products`;
  pool.query(sql, (err, rows, field)=>{
    res.render('productsList.html', { products: rows, user : req.session.user});
  })  
}

const registration = (req, res)=>{
  if(req.session.user == undefined)
    res.render('message.html', {message : "로그인 하세요"});
  else 
    res.render('productRegistration.html', {user : req.session.user});
}

const registrationProcess = (req, res)=>{
  if(req.session.user == undefined)
    res.render('message.html', {message : "로그인 하세요"});
  else {
    let sql = 'INSERT INTO products (category, name, quantity, registrationDate, img, seller) ';
        sql += 'VALUES(?, ?, ?, ?, ?, ?)';
    let values = [req.body.productCategory, req.body.productName, req.body.productQuantity,
                  getDateTime(new Date()), req.file.filename, req.session.user.id];
    pool.query(sql, values, (err, rows, field)=>{
      if(err) throw err;
        res.render("goodmessage.html", {message : "글이 정상적으로 등록되었습니다."}) 
    })
  }
}

const productNum = (req, res)=>{
  let sql = "SELECT * FROM products WHERE idproducts=? ";
  let values = [req.params.productNum];
  pool.query(sql, values, (err, rows, field)=>{
    if(err) throw err;
    res.render('productNum.html', {product : rows[0], user : req.session.user});
  })
}

const productClass = (req, res)=>{
  let sql = `SELECT idproducts, name, quantity, DATE_FORMAT(registrationDate, '%Y-%m-%d') AS date, seller From products WHERE category=?`;
  let values = [req.params.productClass];
  pool.query(sql, values, (err, rows, field)=>{
    res.render('productsList.html', { products: rows, user : req.session.user});
  })    
}

const deletewrite = (req, res)=>{
  let sql = `DELETE FROM products WHERE idproducts = ${req.params.productNum}`;
  pool.query(sql, (err, rows, fields)=>{
    if(err) throw err;
    res.render("goodmessage.html", {message : "글이 정상적으로 삭제되었습니다."});
  })
}

module.exports =  {
  list,
  registration,
  registrationProcess,
  productNum,
  productClass,
  deletewrite,
}
