# MDT 312:Assignment11
MDT 312: WEB PROGRAMMING


**❗ส่งได้ถึงวันที่ 12/11/2567 (ส่งกับ KT,PN)❗**
### โปรดอ่าน  

- โค้ดนี้จัดทำมาเพื่ออธิบายการทำงานของ Node.js ให้เป็นแนวทางการทำงาน Assignment11 เท่านั้น!
  - เราจะทำการสร้างระบบ Login สำหรับ social media โดย Login ของเราจะทำการตรวจสอบ username and password จากข้อมูลใน `js/userDB.json` เพื่อเข้าไปหน้า `feed.html` หลังจากนั้นในหน้า feed เราจะทำการเรียก `postDB.json` เพื่อแสดงข้อความที่เคย post ไปแล้วออกมา 
    - มีการ check cookie ก่อนที่จะเข้าหน้า feed ถ้าไม่มี cookie ที่ชื่อ username จะไม่สามารถเข้าหน้า feed ได้ 
    - ทำระบบ Post ข้อความให้สมบูรณ์โดย save เพิ่มใน `postDB.json` และ post บนลงใน พื้นที่ที่กำหนดให้ 
    - สร้าง profile picture สำหรับ social media ของเรา โดยการ 
    - Upload image file ลง server
    - แก้ไขข้อมูลใน `userDB.json` เมื่อมีการ อัพเดต image file 
    - แสดง รูป profile picture ที่เรา upload ลงไปในพื้นที่ที่กำหนดให้ 
    - แก้แค่ 2 files คือ `feed.js` และ `server.js`


- ***❗โปรดอ่านคำอธิบายพร้อมทดลองเขียนและทำความเข้าใจด้วยตัวเองก่อน หากไม่เข้าใจสามารถถามมาได้ผมจะตอบในช่วงที่สามารถตอบได้ให้เร็วที่สุด❗***

### Trick(เล็กๆน้อยๆ)
- จัดรูปแบบโค้ด: `Shift + Alt + F` (Windows/Linux) หรือ `Shift + Option + F` (Mac)
- แทรกบรรทัดใหม่: `Ctrl + Enter` (Windows/Linux) หรือ `Cmd + Enter` (Mac)
- เลื่อนบรรทัดขึ้น/ลง: `Alt + Up/Down Arrow` (Windows/Linux) หรือ `Option + Up/Down Arrow` (Mac)


ด้วยความปรารถนาดีจาก ผู้สาวซาโต้จัง🌸🌈 **(sarto_)**

# รายละเอียดโค้ด `feed.js`
### ฟังก์ชัน `checkCookie()`
```javascript
function checkCookie() {
    var username = "";  // ประกาศตัวแปร username แต่ไม่ได้ใช้งานในที่นี้
    if (getCookie("username") == false) {  // ตรวจสอบว่า cookie ที่ชื่อว่า "username" มีค่าหรือไม่
        window.location = "index.html";  // ถ้าไม่มี cookie "username" จะเปลี่ยนเส้นทางไปยังหน้าหลัก
    }
}
```
- `var username = "";`: ตัวแปร `username` ถูกประกาศ แต่ไม่ได้ถูกใช้ที่อื่น
- `if (getCookie("username") == false) { ... }`: ใช้ฟังก์ชัน `getCookie("username")` เพื่อตรวจสอบว่าใน `cookie` มีคุกกี้ที่ชื่อว่า `username` หรือไม่ ถ้าไม่มี (ค่าคืนเป็น `false`), ระบบจะนำผู้ใช้ไปยังหน้า `index.html` เพื่อให้กรอกข้อมูลใหม่
#
### ฟังก์ชัน `getCookie(name)`
```javascript
function getCookie(name) {
    const value = `; ${document.cookie}`;  // ดึงค่าทั้งหมดจาก cookie ของ browser
    const parts = value.split(`; ${name}=`);  // แยกคุกกี้ที่มีชื่อเดียวกับ `name`
    if (parts.length === 2) return parts.pop().split(';').shift();  // ถ้าเจอคุกกี้ที่มีชื่อ `name` จะดึงค่าออกมา
}
```
- `const value = \'; ${document.cookie}';`: ค่าทั้งหมดของ `cookie` จะถูกเก็บในตัวแปร `value` โดยเริ่มต้นด้วยเครื่องหมาย `;` เพื่อให้แน่ใจว่าข้อความที่ได้จาก `document.cookie` จะมีรูปแบบที่เหมาะสมในการแยกข้อมูล
- `const parts = value.split(\; ${name}=');`: แยกข้อมูล `cookie` ออกเป็นส่วนต่าง ๆ โดยใช้ตัวแบ่ง `; ${name}=` ซึ่งจะเป็นตัวแบ่งระหว่างชื่อคุกกี้กับค่า
- `if (parts.length === 2) return parts.pop().split(';').shift();`: ถ้าผลลัพธ์มีจำนวนส่วนเท่ากับ 2 (หมายความว่าเจอคุกกี้ที่ชื่อเดียวกับ `name`), ฟังก์ชันจะดึงค่าออกมาโดยใช้ `pop()` เพื่อดึงส่วนที่มีค่าแล้วแยกด้วย `split(';')` และเลือกค่าสุดท้ายที่ไม่มีเครื่องหมาย `;`
#
### ฟังก์ชัน `pageLoad()`
```javascript
function pageLoad() {
    document.getElementById('postbutton').onclick = getData;  // เมื่อคลิกปุ่มที่มี id="postbutton", จะเรียกฟังก์ชัน getData
    document.getElementById('displayPic').onclick = fileUpload;  // เมื่อคลิกที่รูปภาพโปรไฟล์, จะเรียกฟังก์ชัน fileUpload
    document.getElementById('fileField').onchange = fileSubmit;  // เมื่อผู้ใช้เลือกไฟล์จาก input[type="file"], จะเรียกฟังก์ชัน fileSubmit
    
    var username = getCookie('username');  // ดึงค่าชื่อผู้ใช้จาก cookie
    
    document.getElementById("username").innerHTML = username;  // แสดงชื่อผู้ใช้ใน HTML element ที่มี id="username"
    console.log(getCookie('img'));  // แสดงค่าของ cookie ที่ชื่อว่า 'img' ใน console
    showImg('img/' + getCookie('img'));  // เรียกฟังก์ชัน showImg และส่งค่าภาพจาก cookie มาแสดง
    readPost(); // เรียกฟังก์ชัน readPost เพื่อแสดงข้อความที่ Post ทั้งหมด
}
```
- `document.getElementById('postbutton').onclick = getData;`: ตั้งค่าการคลิกปุ่มที่มี `id="postbutton"` ให้เรียกฟังก์ชัน `getData()` เมื่อคลิก
- `document.getElementById('displayPic').onclick = fileUpload;`: ตั้งค่าการคลิกที่รูปภาพที่มี `id="displayPic"` ให้เรียกฟังก์ชัน `fileUpload()`
- `document.getElementById('fileField').onchange = fileSubmit;`: ตั้งค่าการเลือกไฟล์ใน `input` ที่มี `id="fileField"` ให้เรียกฟังก์ชัน `fileSubmit()` เมื่อมีการเลือกไฟล์
- `var username = getCookie('username');`: ดึงชื่อผู้ใช้จาก `cookie` โดยใช้ฟังก์ชัน `getCookie('username')`
- `document.getElementById("username").innerHTML = username;`: ตั้งค่าชื่อผู้ใช้ที่ดึงมาจาก `cookie` ไปแสดงใน HTML โดยใช้ `innerHTML`
- `console.log(getCookie('img'));`: แสดงค่า `img` จาก `cookie` ใน console สำหรับการดีบัก
- `showImg('img/' + getCookie('img'));`: ใช้ฟังก์ชัน `showImg()` เพื่อแสดงภาพโปรไฟล์โดยใช้ค่า `img` จาก `cookie`
- `readPost();`: เรียกฟังก์ชัน `readPost()` เพื่อแสดงความที่ถูกบันทึกในไฟล์ `postDB.json`
#
### `ฟังก์ชัน getData()`
```javascript
function getData() {
    var msg = document.getElementById("textmsg").value;  // ดึงค่าข้อความที่ผู้ใช้พิมพ์ใน textarea ที่มี id="textmsg"
    document.getElementById("textmsg").value = "";  // ล้างค่าของ textarea หลังจากส่งข้อความ
    writePost(msg);  // เรียกฟังก์ชัน writePost เพื่อส่งข้อความไปยัง server
}
```
- `var msg = document.getElementById("textmsg").value;`: ดึงข้อความจาก `textarea` ที่มี `id="textmsg"`
- `document.getElementById("textmsg").value = "";`: ล้างข้อความใน `textarea` หลังจากที่ส่งข้อความ
- `writePost(msg);`: เรียกฟังก์ชัน `writePost()` เพื่อส่งข้อความที่ผู้ใช้พิมพ์ไปยัง server
#
### `ฟังก์ชัน fileUpload()`
```javascript
function fileUpload() {
    document.getElementById('fileField').click();  // เรียกคลิกที่ input[type="file"] เพื่อเปิดกล่องเลือกไฟล์
}
```
- `document.getElementById('fileField').click();`: ฟังก์ชันนี้จะทำให้เกิดการคลิกที่ `input[type="file"]` ที่มี `id="fileField"` ซึ่งจะเปิดหน้าต่างให้ผู้ใช้เลือกไฟล์
#
### `ฟังก์ชัน fileSubmit()`
```javascript
function fileSubmit() {
    document.getElementById('formId').submit();  // ส่งฟอร์มที่มี id="formId" ไปยัง server
}
```
- `document.getElementById('formId').submit();`: ส่งฟอร์มที่มี `id="formId"` ไปยัง server หลังจากผู้ใช้เลือกไฟล์
#
### `ฟังก์ชัน showImg(filename)`
```javascript
function showImg(filename) {
    const imgFileName = getCookie('img');  // ดึงชื่อไฟล์ภาพจาก cookie
    const imgElement = document.querySelector("#displayPic img");  // ค้นหา element <img> ภายใน <div id="displayPic">
    if (imgElement && imgFileName) {  // ถ้าพบทั้ง element img และชื่อไฟล์ภาพ
        imgElement.src = `img/${imgFileName}`;  // กำหนด src ของ <img> ให้เป็นเส้นทางของไฟล์ภาพ
    }
}
```
- `const imgFileName = getCookie('img');`: ดึงชื่อไฟล์ภาพจาก `cookie` ที่ชื่อว่า `img`
- `const imgElement = document.querySelector("#displayPic img");`: ค้นหา `img` ที่อยู่ภายใน `div` ที่มี `id="displayPic"`
- `if (imgElement && imgFileName) { ... }`: ถ้าทั้ง `imgElement` และ `imgFileName` มีค่า, จะทำการตั้งค่าภาพใน `<img>` ด้วย `imgElement.src = 'img/${imgFileName}'`
#
### `ฟังก์ชัน readPost()`
```javascript
async function readPost() {
    try {
        let response = await fetch('/readPost');  // ใช้ fetch เพื่อดึงข้อมูลโพสต์จาก server
        let data = await response.json();  // แปลงข้อมูลที่ได้รับจาก server เป็น JSON
        showPost(data);  // เรียกฟังก์ชัน showPost() เพื่อแสดงโพสต์ที่ได้รับ
    } catch (error) {
        console.error("Error reading posts:", error);  // ถ้าเกิดข้อผิดพลาด ให้แสดงข้อความใน console
    }
}
```
- `let response = await fetch('/readPost');`: ใช้ `fetch` เพื่อดึงข้อมูลโพสต์จาก URL `/readPost` โดยใช้ `async/await` ให้รอจนกว่าจะได้ผลลัพธ์
- `let data = await response.json();`: แปลงข้อมูลที่ได้รับจาก server ให้เป็น JSON
- `showPost(data);`: เรียกฟังก์ชัน `showPost(data)` เพื่อแสดงโพสต์ที่ได้รับจาก server
- `console.error("Error reading posts:", error);`: ถ้ามีข้อผิดพลาดในการดึงข้อมูลจาก server จะพิมพ์ข้อผิดพลาดใน console
#
### `ฟังก์ชัน showPost(posts)`
```javascript
function showPost(posts) {
    posts.forEach(function(post) {  // ใช้ loop เพื่อแสดงโพสต์ทั้งหมด
        const postElement = document.createElement('div');  // สร้าง div ใหม่สำหรับแต่ละโพสต์
        postElement.classList.add('newsfeed');  // เพิ่มคลาส 'newsfeed' ให้กับ div
        postElement.innerHTML = post.message;  // ใส่ข้อความโพสต์ลงใน div
        document.getElementById("feed-container").appendChild(postElement);  // เพิ่ม div ลงใน feed-container
    });
}
```
- `posts.forEach(function(post) { ... });`: ใช้ `forEach` เพื่อวนลูปโพสต์แต่ละโพสต์ใน `posts`
- `const postElement = document.createElement('div');`: สร้าง element `<div>` สำหรับแต่ละโพสต์
- `postElement.classList.add('newsfeed');`: เพิ่มคลาส `newsfeed` ให้กับ `div`
- `postElement.innerHTML = post.message;`: ใส่ข้อความโพสต์ใน `innerHTML` ของ `div`
- `document.getElementById("feed-container").appendChild(postElement);`: เพิ่ม `div` ของโพสต์เข้าไปใน `#feed-container`
  
# รายละเอียดโค้ด `server.js`
### การกำหนดค่าพื้นฐาน
```javascript
const express = require('express'); // นำเข้า express ซึ่งเป็นเครื่องมือสำหรับสร้างเซิร์ฟเวอร์ HTTP ใน Node.js
const app = express(); // สร้างอินสแตนซ์ของ express
const fs = require('fs'); // นำเข้า fs (file system) เพื่ออ่าน/เขียนไฟล์
const hostname = 'localhost'; // ตั้งค่าชื่อโฮสต์เป็น localhost
const port = 3000; // ตั้งค่าพอร์ตเซิร์ฟเวอร์เป็น 3000
const bodyParser = require('body-parser'); // นำเข้า body-parser เพื่อแปลงข้อมูลจาก body ของ request
var cookieParser = require('cookie-parser'); // นำเข้า cookie-parser เพื่ออ่าน/เขียนคุกกี้
const multer = require('multer'); // นำเข้า multer เพื่อจัดการการอัปโหลดไฟล์
const path = require('path'); // นำเข้า path สำหรับการจัดการเส้นทางของไฟล์
```
- `const express = require('express');`
  - นำเข้า Express: นำเข้าโมดูล `express` ซึ่งเป็นเฟรมเวิร์กที่ช่วยให้การสร้างเซิร์ฟเวอร์เว็บด้วย Node.js ง่ายขึ้น
- `const app = express();`
  - สร้างแอปพลิเคชัน Express: สร้างอินสแตนซ์ของ `Express` และเก็บไว้ในตัวแปร `app` ซึ่งจะใช้ในการกำหนดเส้นทางและตั้งค่าเซิร์ฟเวอร์
- `const fs = require('fs');`
  - นำเข้า File System (fs): นำเข้าโมดูล `fs` ที่ใช้สำหรับการทำงานกับไฟล์ เช่น การอ่านและเขียนไฟล์
- `const hostname = 'localhost';`
  - กำหนด hostname: กำหนดให้เซิร์ฟเวอร์รันบน `localhost` ซึ่งหมายถึงเครื่องคอมพิวเตอร์ที่กำลังรันเซิร์ฟเวอร์อยู่
- `const port = 3000;`
  - กำหนด port: กำหนดให้เซิร์ฟเวอร์ฟังคำขอที่พอร์ต `3000`
- `const bodyParser = require('body-parser');`
  - นำเข้า body-parser: นำเข้าโมดูล `body-parser` ที่ช่วยแปลงข้อมูลจาก request body เช่น JSON หรือ URL-encoded เพื่อให้สามารถใช้งานในโค้ดได้ง่ายขึ้น
- `var cookieParser = require('cookie-parser');`
  - นำเข้า cookie-parser: นำเข้าโมดูล `cookie-parser` ที่ใช้ในการอ่านและเขียนคุกกี้จาก request ที่ส่งมาจาก client
- `const multer = require('multer');`
  - นำเข้า multer: นำเข้าโมดูล `multer` ที่ใช้สำหรับจัดการการอัปโหลดไฟล์จาก client
- `const path = require('path');`
  - นำเข้า path: นำเข้าโมดูล `path` ที่ช่วยในการจัดการเส้นทางของไฟล์และโฟลเดอร์บนระบบไฟล์
#
### การตั้งค่า Middleware และ Static Files
```javascript
app.use(express.static(__dirname)); // ใช้ express.static สำหรับเสิร์ฟไฟล์ที่อยู่ในไดเรกทอรีปัจจุบัน
app.use(bodyParser.json()); // ใช้ bodyParser เพื่อแปลงข้อมูล JSON จาก client
app.use(bodyParser.urlencoded({ extended: false })); // ใช้ bodyParser สำหรับข้อมูลที่เป็น URL encoded
app.use(cookieParser()); // ใช้ cookieParser เพื่อจัดการคุกกี้
```
- `app.use(express.static(__dirname));`
  - ใช้ `express.static`: กำหนดให้ Express เสิร์ฟไฟล์สาธารณะ (เช่น `HTML`, `CSS`, `JavaScript`) จากโฟลเดอร์ปัจจุบัน (`__dirname` คือเส้นทางของโฟลเดอร์ที่ไฟล์เซิร์ฟเวอร์นี้อยู่)
- `app.use(bodyParser.json());`
  - ใช้ `bodyParser` สำหรับ JSON: ใช้ bodyParser เพื่อแปลงข้อมูลที่ส่งมาในรูปแบบ JSON ให้สามารถเข้าถึงได้ใน `req.body`
- `app.use(bodyParser.urlencoded({ extended: false }));`
  - ใช้ bodyParser สำหรับ URL-encoded: ใช้ bodyParser เพื่อแปลงข้อมูลที่ส่งมาในรูปแบบ URL-encoded (เช่น จากฟอร์ม `HTML`) ให้สามารถเข้าถึงได้ใน `req.body`
- `app.use(cookieParser());`
  - ใช้ cookieParser: ใช้ `cookieParser` เพื่อแยกและจัดการคุกกี้ที่ส่งมาจาก client ทำให้สามารถเข้าถึงคุกกี้ได้ง่ายขึ้นผ่าน `req.cookies`
#
### การตั้งค่า Multer สำหรับการอัปโหลดไฟล์
```javascript
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, 'img/'); // ระบุว่าต้องการบันทึกไฟล์ในโฟลเดอร์ 'img/'
    },

    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // ตั้งชื่อไฟล์ให้ไม่ซ้ำโดยเพิ่ม timestamp และนามสกุลไฟล์
    }
});
```
- `const storage = multer.diskStorage({ ... });`
  - กำหนดการจัดเก็บไฟล์: ใช้ `multer.diskStorage` เพื่อกำหนดวิธีการจัดเก็บไฟล์ที่อัปโหลด
- `destination: (req, file, callback) => { callback(null, 'img/'); }`
  - กำหนดโฟลเดอร์เก็บไฟล์: กำหนดให้ไฟล์ที่อัปโหลดจะถูกเก็บไว้ในโฟลเดอร์ `img/`
  - `callback(null, 'img/');`: ไม่มีข้อผิดพลาด (null) และกำหนดโฟลเดอร์เป็น `'img/'`
- `filename: (req, file, cb) => { ... }`
  - กำหนดชื่อไฟล์: กำหนดชื่อไฟล์ที่เก็บ โดยใช้ชื่อฟิลด์ (`file.fieldname`), timestamp (`Date.now()`) และนามสกุลของไฟล์ต้นฉบับ (`path.extname(file.originalname)`)
  - `cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));`: ไม่มีข้อผิดพลาด (`null`) และตั้งชื่อไฟล์เป็นรูปแบบ เช่น avatar-1632761234567.jpg
    
```javascript
const imageFilter = (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!'; // ถ้าไฟล์ไม่ใช่รูปภาพ
        return cb(new Error('Only image files are allowed!'), false); // ส่งข้อผิดพลาดกลับ
    }
    cb(null, true); // ถ้าเป็นรูปภาพให้อนุญาตการอัปโหลด
};
```
- `const imageFilter = (req, file, cb) => { ... };`
  - กำหนดฟิลเตอร์สำหรับไฟล์ภาพ: ฟังก์ชันนี้ตรวจสอบว่าไฟล์ที่อัปโหลดเป็นไฟล์ภาพประเภทใดบ้าง (เช่น `.jpg`, `.png`, `.gif`)
- `if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) { ... }`
  - ตรวจสอบนามสกุลไฟล์: ถ้าไฟล์ที่อัปโหลดไม่มีนามสกุลที่ระบุ จะกำหนดข้อผิดพลาด
- `req.fileValidationError = 'Only image files are allowed!';`
  - ตั้งค่าข้อผิดพลาด: ตั้งค่าข้อผิดพลาดที่เก็บใน `req.fileValidationError`
- `return cb(new Error('Only image files are allowed!'), false);`
  - ส่งข้อผิดพลาดและปฏิเสธการอัปโหลด: ส่งข้อผิดพลาดและบอกให้ multer ปฏิเสธการอัปโหลดไฟล์นี้
- `cb(null, true);`
  - อนุญาตการอัปโหลดไฟล์: ถ้าไฟล์เป็นไฟล์ภาพที่อนุญาตให้ อนุญาตให้ multer ดำเนินการต่อ

```javascript
const upload = multer({ storage: storage, fileFilter: imageFilter }).single('avatar');
```
- `const upload = multer({ storage: storage, fileFilter: imageFilter }).single('avatar');`
  - สร้างตัวอัปโหลดไฟล์: สร้างตัวอัปโหลดไฟล์ที่ใช้การตั้งค่าจาก `storage` และ `imageFilter`
  - `.single('avatar')`: กำหนดให้รับการอัปโหลดไฟล์เดียวที่มีฟิลด์ชื่อ avatar

#
### `/profilepic` สำหรับอัพโหลดภาพโปรไฟล์
```javascript
app.post('/profilepic', (req, res) => {
    upload(req, res, function (err) {
        // ถ้าพบข้อผิดพลาดระหว่างการอัปโหลดไฟล์
        if (req.fileValidationError) {
            return res.send(req.fileValidationError); // ส่งข้อความข้อผิดพลาด
        } else if (!req.file) {
            return res.send('Please select an image to upload'); // ถ้าไม่มีไฟล์อัปโหลด
        } else if (err instanceof multer.MulterError) {
            return res.send(err); // ถ้าเกิดข้อผิดพลาดของ multer
        } else if (err) {
            return res.send(err); // ข้อผิดพลาดอื่น ๆ
        }

        const username = req.cookies.username; // ดึงชื่อผู้ใช้จากคุกกี้
        if (username) {
            const filePath = req.file.filename; // รับชื่อไฟล์ที่อัปโหลด
            updateImg(username, filePath); // อัปเดตภาพโปรไฟล์ในฐานข้อมูล

            res.cookie('img', filePath, { path: '/' }); // บันทึกภาพโปรไฟล์ในคุกกี้
        }

        return res.redirect('feed.html'); // เปลี่ยนเส้นทางไปที่หน้า feed.html
    });
});
```
- `app.post('/profilepic', (req, res) => { ... });`
  - กำหนดเส้นทาง POST `/profilepic`: เมื่อมีคำขอ POST มาที่ `/profilepic` เซิร์ฟเวอร์จะทำงานตามฟังก์ชันนี้เพื่อจัดการการอัปโหลดภาพโปรไฟล์
- `upload(req, res, function (err) { ... });`
  - ใช้ multer เพื่อจัดการการอัปโหลดไฟล์: เรียกใช้ตัวอัปโหลดที่สร้างขึ้นมา (upload) เพื่อจัดการการอัปโหลดไฟล์จากคำขอนี้
- `if (req.fileValidationError) { ... }`
  - ตรวจสอบข้อผิดพลาดจากฟิลเตอร์: ถ้ามีข้อผิดพลาดจากการตรวจสอบฟิลเตอร์ไฟล์ (เช่น ไฟล์ไม่ใช่ภาพ) จะส่งข้อความข้อผิดพลาดกลับไปยัง client
- `else if (!req.file) { ... }`
  - ตรวจสอบว่ามีไฟล์ถูกอัปโหลดหรือไม่: ถ้าไม่มีไฟล์ถูกอัปโหลด (ผู้ใช้ไม่ได้เลือกไฟล์) จะส่งข้อความให้เลือกไฟล์เพื่ออัปโหลด
- `else if (err instanceof multer.MulterError) { ... }`
  - ตรวจสอบข้อผิดพลาดจาก multer: ถ้ามีข้อผิดพลาดที่มาจาก multer (เช่น ขนาดไฟล์ใหญ่เกินไป) จะส่งข้อผิดพลาดกลับไป
- `else if (err) { ... }`
  - ตรวจสอบข้อผิดพลาดอื่น ๆ: ถ้ามีข้อผิดพลาดอื่น ๆ จะส่งข้อผิดพลาดกลับไป
- `const username = req.cookies.username;`
  - ดึงชื่อผู้ใช้จากคุกกี้: ดึงค่า username จากคุกกี้ที่ถูกตั้งไว้ในเบราว์เซอร์
- `if (username) { ... }`
  - ตรวจสอบว่ามีชื่อผู้ใช้ในคุกกี้หรือไม่: ถ้ามีชื่อผู้ใช้ จะทำการอัปเดตภาพโปรไฟล์
- `const filePath = req.file.filename;`
  - ดึงชื่อไฟล์ที่อัปโหลด: ดึงชื่อไฟล์ที่ถูกอัปโหลดจาก `req.file.filename`
- `updateImg(username, filePath);`
  - อัปเดตภาพโปรไฟล์ในฐานข้อมูล: เรียกใช้ฟังก์ชัน `updateImg` เพื่ออัปเดตข้อมูลภาพโปรไฟล์ของผู้ใช้ในฐานข้อมูล
- `res.cookie('img', filePath, { path: '/' });`
  - ตั้งคุกกี้ใหม่สำหรับภาพโปรไฟล์: ตั้งคุกกี้ชื่อ `img` ให้เก็บชื่อไฟล์ภาพโปรไฟล์ที่อัปโหลด พร้อมกำหนดเส้นทางให้เป็น `/` เพื่อให้สามารถเข้าถึงได้จากทุกเส้นทางในเว็บแอป
- `return res.redirect('feed.html');`
  - เปลี่ยนเส้นทางไปยังหน้า `feed.html`: หลังจากอัปโหลดและอัปเดตข้อมูลเสร็จสิ้น จะเปลี่ยนเส้นทางผู้ใช้ไปยังหน้า `feed.html`
#
### `/logout` สำหรับออกจากระบบ
```javascript
app.get('/logout', (req, res) => {
    res.clearCookie('username'); // ลบคุกกี้ 'username'
    res.clearCookie('img'); // ลบคุกกี้ 'img'
    return res.redirect('index.html'); // เปลี่ยนเส้นทางไปที่หน้า index.html
});
```
- `app.get('/logout', (req, res) => { ... });`
  - กำหนดเส้นทาง GET `/logout`: เมื่อมีคำขอ GET มาที่ `/logout` เซิร์ฟเวอร์จะทำงานตามฟังก์ชันนี้เพื่อจัดการการออกจากระบบ
- `res.clearCookie('username');`
  - ลบคุกกี้ `username`: ลบคุกกี้ที่เก็บชื่อผู้ใช้ออกจากเบราว์เซอร์
- `res.clearCookie('img');`
  - ลบคุกกี้ `img`: ลบคุกกี้ที่เก็บชื่อไฟล์ภาพโปรไฟล์ออกจากเบราว์เซอร์
- `return res.redirect('index.html');`
  - เปลี่ยนเส้นทางไปยังหน้า `index.html`: หลังจากลบคุกกี้แล้ว จะเปลี่ยนเส้นทางผู้ใช้กลับไปยังหน้า `index.html`
#
### `/readPost` สำหรับอ่านโพสต์จากฐานข้อมูล
```javascript
app.get('/readPost', async (req, res) => {
    let posts = await readJson('js/postDB.json'); // อ่านข้อมูลโพสต์จากไฟล์ JSON
    res.json(posts); // ส่งข้อมูลโพสต์กลับเป็น JSON
});
```
- `app.get('/readPost', async (req, res) => { ... });`
  - กำหนดเส้นทาง GET `/readPost`: เมื่อมีคำขอ GET มาที่ `/readPost` เซิร์ฟเวอร์จะทำงานตามฟังก์ชันนี้เพื่ออ่านข้อมูลโพสต์
- `let posts = await readJson('js/postDB.json');`
  - อ่านข้อมูลโพสต์จากไฟล์ `JSON`: ใช้ฟังก์ชัน `readJson` เพื่ออ่านข้อมูลจากไฟล์ `postDB.json` ซึ่งเก็บโพสต์ทั้งหมดไว้
- `res.json(posts);`
  - ส่งข้อมูลโพสต์กลับไปยัง client ในรูปแบบ `JSON`: ส่งข้อมูลโพสต์ที่อ่านได้กลับไปยัง client ในรูปแบบ `JSON`
#
### `/writePost` สำหรับเขียนโพสต์ใหม่
```javascript
app.post('/writePost', async (req, res) => {
    let postData = await readJson('js/postDB.json'); // อ่านข้อมูลโพสต์จากไฟล์
    let newKey = `post${Date.now()}`; // สร้าง key ใหม่ตามเวลา
    postData[newKey] = { user: req.body.user, message: req.body.message }; // เพิ่มโพสต์ใหม่

    await writeJson(postData, 'js/postDB.json'); // บันทึกข้อมูลโพสต์ใหม่ลงในไฟล์
    res.sendStatus(200); // ส่งสถานะ 200 (สำเร็จ)
});
```
- `app.post('/writePost', async (req, res) => { ... });`
  - กำหนดเส้นทาง POST `/writePost`: เมื่อมีคำขอ POST มาที่ `/writePost` เซิร์ฟเวอร์จะทำงานตามฟังก์ชันนี้เพื่อเพิ่มโพสต์ใหม่ลงในฐานข้อมูล
- `let postData = await readJson('js/postDB.json');`
  - อ่านข้อมูลโพสต์จากไฟล์ `JSON`: ใช้ฟังก์ชัน `readJson` เพื่ออ่านข้อมูลโพสต์ทั้งหมดจากไฟล์ `postDB.json`
- `let newKey = \post${Date.now()}`;`
  - สร้างคีย์ใหม่สำหรับโพสต์: ใช้ `Date.now()` เพื่อสร้างคีย์ใหม่ที่ไม่ซ้ำกัน เช่น post1632761234567
- `postData[newKey] = { user: req.body.user, message: req.body.message };`
  - เพิ่มโพสต์ใหม่ลงในข้อมูลโพสต์: เพิ่มข้อมูลโพสต์ใหม่ที่มี user และ message ลงใน postData โดยใช้คีย์ที่สร้างขึ้นใหม่
- `await writeJson(postData, 'js/postDB.json');`
  - บันทึกข้อมูลโพสต์ลงในไฟล์ `JSON`: ใช้ฟังก์ชัน `writeJson` เพื่อเขียนข้อมูลโพสต์ที่อัปเดตลงในไฟล์ `postDB.json`
- `res.sendStatus(200);`
  - ส่งสถานะ `200` (OK) กลับไปยัง client: บอกให้ client ว่าการเขียนโพสต์สำเร็จ
 
#
### `/checkLogin` สำหรับตรวจสอบการเข้าสู่ระบบ
```javascript
app.post('/checkLogin',async (req,res) => {
    const { username, password } = req.body;  // ดึง username และ password จาก request

    const userDataPath = path.join(__dirname, 'js', 'userDB.json');  // ระบุเส้นทางไฟล์ userDB.json
    fs.readFile(userDataPath, 'utf-8', (err, data) => {
        if (err) {
            console.error('Error reading userDB.json:', err);
            return res.redirect('index.html?error=1');  // ส่งกลับไปหน้า index พร้อม error
        }

        const users = JSON.parse(data);  // แปลงข้อมูล JSON เป็น Object
        let isAuthenticated = false;
        for (let key in users) {
            if (users[key].username === username && users[key].password === password) {  // ตรวจสอบความถูกต้อง
                isAuthenticated = true;
                res.cookie('username', username);  // ตั้งค่า username ลงในคุกกี้
                res.cookie('img', users[key].img); // ตั้งค่าภาพโปรไฟล์ในคุกกี้
                return res.redirect('feed.html');  // เปลี่ยนเส้นทางไปที่ feed.html
            }
        }

        if (!isAuthenticated) {
            return res.redirect('index.html?error=1');  // ส่งกลับไปหน้า index พร้อม error หากข้อมูลไม่ถูกต้อง
        }
    });
})
```
- `app.post('/checkLogin', async (req, res) => { ... });`
  - กำหนดเส้นทาง POST `/checkLogin`: เมื่อมีคำขอ POST มาที่ `/checkLogin` เซิร์ฟเวอร์จะทำงานตามฟังก์ชันนี้เพื่อยืนยันการเข้าสู่ระบบของผู้ใช้
- `const { username, password } = req.body;`
  - ดึงข้อมูล username และ password จากคำขอ: ใช้การ destructure ของ JavaScript เพื่อดึงค่า username และ password จาก `req.body` ซึ่งเป็นข้อมูลที่ผู้ใช้กรอกเข้ามาในฟอร์ม
- `const userDataPath = path.join(__dirname, 'js', 'userDB.json');`
  - กำหนดเส้นทางไฟล์ฐานข้อมูลผู้ใช้: ใช้ `path.join` เพื่อสร้างเส้นทางไปยังไฟล์ `userDB.json` ซึ่งเก็บข้อมูลผู้ใช้ทั้งหมด
- `fs.readFile(userDataPath, 'utf-8', (err, data) => { ... });`
  - อ่านไฟล์ฐานข้อมูลผู้ใช้: ใช้ `fs.readFile` เพื่ออ่านข้อมูลจากไฟล์ `userDB.json` ในรูปแบบ `utf-8`
- `if (err) { ... }`
  - ตรวจสอบข้อผิดพลาดในการอ่านไฟล์: ถ้ามีข้อผิดพลาดในการอ่านไฟล์ เช่น ไฟล์ไม่พบหรือมีปัญหาอื่น ๆ จะทำการล็อกข้อผิดพลาดและเปลี่ยนเส้นทางไปที่หน้า `index.html` พร้อมกับพารามิเตอร์ `error=1`
- `const users = JSON.parse(data);`
  - แปลงข้อมูล JSON เป็นวัตถุ `JavaScript`: แปลงข้อมูลที่อ่านมาจากไฟล์ `userDB.json` ให้อยู่ในรูปแบบวัตถุที่สามารถใช้งานได้ในโค้ด
- `let isAuthenticated = false;`
  - ตั้งค่าตัวแปรตรวจสอบการยืนยันตัวตน: ตั้งค่าเริ่มต้นว่าไม่ผ่านการยืนยันตัวตน
- `for (let key in users) { ... }`
  - วนลูปผ่านผู้ใช้ทั้งหมดในฐานข้อมูล: วนลูปผ่านทุกผู้ใช้ที่มีอยู่ใน users
- `if (users[key].username === username && users[key].password === password) { ... }`
  - ตรวจสอบชื่อผู้ใช้และรหัสผ่าน: ตรวจสอบว่าชื่อผู้ใช้และรหัสผ่านที่ส่งมาจาก client ตรงกับผู้ใช้ในฐานข้อมูลหรือไม่
- `isAuthenticated = true;`
  - ตั้งค่าการยืนยันตัวตนเป็นผ่าน: ถ้าชื่อผู้ใช้และรหัสผ่านถูกต้อง จะตั้งค่าตัวแปร isAuthenticated เป็น true
- `res.cookie('username', username);`
  - ตั้งคุกกี้ username: ตั้งคุกกี้ชื่อ `username` เพื่อเก็บชื่อผู้ใช้ที่ล็อกอินเข้ามา
- `res.cookie('img', users[key].img);`
  - ตั้งคุกกี้ img: ตั้งคุกกี้ชื่อ `img` เพื่อเก็บชื่อไฟล์ภาพโปรไฟล์ของผู้ใช้
- `return res.redirect('feed.html');`
  - เปลี่ยนเส้นทางไปยังหน้า `feed.html`: ถ้าการล็อกอินผ่าน จะเปลี่ยนเส้นทางผู้ใช้ไปยังหน้า `feed.html`
- `if (!isAuthenticated) { ... }`
  - เปลี่ยนเส้นทางไปยังหน้า `index.html` พร้อมกับพารามิเตอร์ `error=1`: ถ้าการล็อกอินไม่ผ่าน จะเปลี่ยนเส้นทางไปยังหน้า `index.html` พร้อมกับส่งพารามิเตอร์ `error=1` เพื่อแสดงข้อความผิดพลาด
 
#
### ฟังก์ชัน `readJson` สำหรับอ่านไฟล์ JSON
```javascript
const readJson = (file_name) => {
    return new Promise((resolve, reject) => {
        fs.readFile(file_name, 'utf8', (err, data) => {
            if (err) reject(err);  // หากมีข้อผิดพลาด ให้ปฏิเสธ Promise
            else resolve(JSON.parse(data));  // หากไม่มีข้อผิดพลาด ให้คืนค่าเป็น Object ที่แปลงจาก JSON
        });
    });
}
```
- `const readJson = (file_name) => { ... };`
  - ฟังก์ชันอ่านไฟล์ JSON: ฟังก์ชันนี้ใช้เพื่ออ่านข้อมูลจากไฟล์ `JSON` และแปลงข้อมูลนั้นเป็นวัตถุ JavaScript
- `return new Promise((resolve, reject) => { ... });`
  - สร้าง Promise: สร้าง `Promise` เพื่อให้สามารถใช้ `await` กับฟังก์ชันนี้ได้
- `fs.readFile(file_name, 'utf8', (err, data) => { ... });`
  - อ่านไฟล์: ใช้ `fs.readFile` เพื่ออ่านข้อมูลจากไฟล์ที่ระบุในตัวแปร `file_name` ในรูปแบบ `utf8`
- `if (err) reject(err);`
  - ตรวจสอบข้อผิดพลาดในการอ่านไฟล์: ถ้ามีข้อผิดพลาดในการอ่านไฟล์ จะทำการปฏิเสธ Promise ด้วยข้อผิดพลาดนั้น
- `else resolve(JSON.parse(data));`
  - แปลงข้อมูล `JSON` และส่งคืน: ถ้าอ่านไฟล์สำเร็จ จะแปลงข้อมูลจาก `JSON` เป็นวัตถุ `JavaScript` และส่งคืนผ่าน resolve
 
#
### ฟังก์ชัน `writeJson` สำหรับเขียนไฟล์ JSON
```javascript
const writeJson = (data,file_name) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(file_name, JSON.stringify(data, null, 2), 'utf8', (err) => {
            if (err) reject(err);  // หากมีข้อผิดพลาด ให้ปฏิเสธ Promise
            else resolve();  // หากเขียนสำเร็จ ให้ทำสำเร็จ Promise
        });
    });
}
```
- `const writeJson = (data, file_name) => { ... };`
  - ฟังก์ชันเขียนไฟล์ JSON: ฟังก์ชันนี้ใช้เพื่อเขียนข้อมูลลงในไฟล์ `JSON` โดยแปลงข้อมูลเป็นสตริง `JSON` ก่อนเขียน
- `return new Promise((resolve, reject) => { ... });`
  - สร้าง Promise: สร้าง Promise เพื่อให้สามารถใช้ `await` กับฟังก์ชันนี้ได้
- `fs.writeFile(file_name, JSON.stringify(data, null, 2), 'utf8', (err) => { ... });`
  - เขียนไฟล์: ใช้ `fs.writeFile` เพื่อเขียนข้อมูลลงในไฟล์ที่ระบุใน `file_name`
  - `JSON.stringify(data, null, 2)`: แปลงข้อมูล data เป็นสตริง JSON โดยจัดรูปแบบให้อ่านง่าย (`null`, `2` คือการตั้งค่าการจัดวาง)
- `if (err) reject(err);`
  - ตรวจสอบข้อผิดพลาดในการเขียนไฟล์: ถ้ามีข้อผิดพลาดในการเขียนไฟล์ จะทำการปฏิเสธ Promise ด้วยข้อผิดพลาดนั้น
- `else resolve();`
  - ส่งคืน Promise ว่าสำเร็จ: ถ้าเขียนไฟล์สำเร็จ จะส่งคืน Promise ว่าสำเร็จผ่าน resolve
 
#
### ฟังก์ชัน `updateImg` สำหรับอัพเดตภาพโปรไฟล์ของผู้ใช้
```javascript
const updateImg = async (username, fileimg) => {
    const filePath = './js/userDB.json';
    
    try {
        const data = await fs.promises.readFile(filePath, 'utf8');
        const users = JSON.parse(data);

        let userFound = false;
        for (const key in users) {
            if (users[key].username === username) {
                users[key].img = fileimg;
                userFound = true;
                break;
            }
        }

        if (userFound) {
            await fs.promises.writeFile(filePath, JSON.stringify(users, null, 2));
            console.log(`Updated image for user ${username} to ${fileimg}`);
        } else {
            console.log(`User ${username} not found in database`);
        }
    } catch (error) {
        console.error("Error updating image:", error);
    }
};
```
- `const updateImg = async (username, fileimg) => { ... };`
  - ฟังก์ชันอัปเดตภาพโปรไฟล์: ฟังก์ชันนี้ใช้เพื่ออัปเดตข้อมูลภาพโปรไฟล์ของผู้ใช้ในไฟล์ฐานข้อมูล JSON
- `const filePath = './js/userDB.json';`
  - กำหนดเส้นทางไฟล์ฐานข้อมูลผู้ใช้: กำหนดเส้นทางไปยังไฟล์ `userDB.json` ที่เก็บข้อมูลผู้ใช้ทั้งหมด
- `try { ... } catch (error) { ... }`
  - ใช้ `try-catch` เพื่อจัดการข้อผิดพลาด: พยายามทำงานภายใน try และจับข้อผิดพลาดที่เกิดขึ้นใน catch
- `const data = await fs.promises.readFile(filePath, 'utf8');`
  - อ่านไฟล์ฐานข้อมูลผู้ใช้: ใช้ `fs.promises.readFile` เพื่ออ่านข้อมูลจากไฟล์ `userDB.json` ในรูปแบบ utf8
- `const users = JSON.parse(data);`
  - แปลงข้อมูล JSON เป็นวัตถุ `JavaScript`: แปลงข้อมูลที่อ่านจากไฟล์เป็นวัตถุที่สามารถใช้งานได้ในโค้ด
- `let userFound = false;`
  - ตั้งค่าตัวแปรตรวจสอบการค้นหาผู้ใช้: ตั้งค่าตัวแปร `userFound` เป็น `false` เพื่อใช้ตรวจสอบว่าพบผู้ใช้หรือไม่
- `for (const key in users) { ... }`
  - วนลูปผ่านผู้ใช้ทั้งหมดในฐานข้อมูล: วนลูปผ่านทุกผู้ใช้ที่มีอยู่ใน users
- `if (users[key].username === username) { ... }`
  - ตรวจสอบชื่อผู้ใช้: ถ้าชื่อผู้ใช้ในฐานข้อมูลตรงกับชื่อผู้ใช้ที่ส่งมา จะทำการอัปเดตภาพโปรไฟล์
- `users[key].img = fileimg;`
  - อัปเดตภาพโปรไฟล์ของผู้ใช้: ตั้งค่าฟิลด์ `img` ของผู้ใช้เป็นชื่อไฟล์ภาพที่อัปโหลด
- `userFound = true;`
  - ตั้งค่าตัวแปรตรวจสอบการค้นหาผู้ใช้เป็นผ่าน: ตั้งค่าตัวแปร `userFound` เป็น `true` เพื่อบ่งบอกว่าพบผู้ใช้แล้ว
- `break;`
  - ออกจากลูป: หยุดการวนลูปเนื่องจากพบผู้ใช้แล้ว
- `if (userFound) { ... } else { ... }`
  - ตรวจสอบว่าพบผู้ใช้หรือไม่: ถ้าพบผู้ใช้ จะทำการเขียนข้อมูลที่อัปเดตลงในไฟล์ `userDB.json` และแสดงข้อความใน console ว่าอัปเดตสำเร็จ
  - `await fs.promises.writeFile(filePath, JSON.stringify(users, null, 2));`
    - เขียนข้อมูลที่อัปเดตลงในไฟล์ `JSON`: เขียนข้อมูล users ที่อัปเดตแล้วลงในไฟล์ `userDB.json`
  - `console.log(\Updated image for user ${username} to ${fileimg}`);``
    - แสดงข้อความใน console: แจ้งว่าภาพโปรไฟล์ของผู้ใช้ถูกอัปเดตเรียบร้อยแล้ว
  - `else { ... }`
    - ถ้าหาผู้ใช้ไม่พบ: แสดงข้อความใน console ว่าผู้ใช้ไม่พบในฐานข้อมูล
    - `console.log(\User ${username} not found in database`);``
      - แสดงข้อความใน console: แจ้งว่าผู้ใช้ไม่พบในฐานข้อมูล
- `catch (error) { ... }`
  - จับข้อผิดพลาดที่เกิดขึ้นใน `try block`: ถ้ามีข้อผิดพลาดในการอ่านหรือเขียนไฟล์ จะทำการล็อกข้อผิดพลาดใน console
  - `console.error("Error updating image:", error);`
    - แสดงข้อความผิดพลาดใน console: แจ้งว่ามีข้อผิดพลาดในการอัปเดตภาพโปรไฟล์
   
#
### การเริ่มต้นเซิร์ฟเวอร์
```javascript
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
```
- `app.listen(port, hostname, () => { ... });`
  - เริ่มต้นเซิร์ฟเวอร์ Express: เซิร์ฟเวอร์จะเริ่มฟังคำขอที่ `hostname` และ `port` ที่กำหนดไว้
- `console.log(\Server running at http://${hostname}:${port}/`);``
  - แสดงข้อความใน console: แจ้งว่าเซิร์ฟเวอร์กำลังทำงานอยู่ที่ URL `http://localhost:3000/`

# วิธีการใช้งาน:
1. ติดตั้ง dependencies ที่จำเป็น
  - เปิด Terminal หรือ Command Prompt แล้วไปยังโฟลเดอร์ที่มีไฟล์โปรเจกต์
  - รันคำสั่งด้านล่างเพื่อติดตั้ง `express`, `cookie-parser`, `multer` และ `body-parser`
  ```bash
  npm install express body-parser cookie-parser multer
  ```
2. รันเซิร์ฟเวอร์
  - รันคำสั่งด้านล่างใน Terminal เพื่อเริ่มต้นเซิร์ฟเวอร์
  ```bash
  node server.js
  ```
  - เมื่อรันสำเร็จ จะต้องเห็นข้อความแจ้งว่าเซิร์ฟเวอร์กำลังทำงาน
  ```plaintext
  Server running at http://localhost:3000/
  ```
3. เปิดเว็บเบราว์เซอร์เพื่อเข้าถึงแชทรูม
  - เปิดเว็บเบราว์เซอร์แล้วไปที่ URL: http://localhost:3000/ (หรือ กดที่แสดงใน Terminal ก็ได้ กด `Shift+click` ที่ Server running at `http://localhost:3000/`)

### หมายเหตุ
- อย่าลืมดู Cookies กันด้วยนะ
