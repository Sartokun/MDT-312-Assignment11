const express = require('express');
const app = express();
const fs = require('fs');
const hostname = 'localhost';
const port = 3000;
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const multer = require('multer');
const path = require('path');

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, 'img/');
    },

    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });

  const imageFilter = (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: imageFilter }).single('avatar');

//ทำให้สมบูรณ์
app.post('/profilepic', (req,res) => {
    upload(req, res, function (err) {
        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        } else if (!req.file) {
            return res.send('Please select an image to upload');
        } else if (err instanceof multer.MulterError) {
            return res.send(err);
        } else if (err) {
            return res.send(err);
        }

        const username = req.cookies.username;
        if (username) {
            const filePath = req.file.filename;
            updateImg(username, filePath);

            res.cookie('img', filePath, { path: '/' });
        }

        return res.redirect('feed.html');
    });
 })

//ทำให้สมบูรณ์
// ถ้าต้องการจะลบ cookie ให้ใช้
// res.clearCookie('username');
app.get('/logout', (req,res) => {
    res.clearCookie('username');
    res.clearCookie('img');
    return res.redirect('index.html');
})

//ทำให้สมบูรณ์
app.get('/readPost', async (req,res) => {
    let posts = await readJson('js/postDB.json');
    res.json(posts);
})

//ทำให้สมบูรณ์
app.post('/writePost',async (req,res) => {
    let postData = await readJson('js/postDB.json');
    let newKey = `post${Date.now()}`;
    postData[newKey] = { user: req.body.user, message: req.body.message };

    await writeJson(postData, 'js/postDB.json');
    res.sendStatus(200);
})

//ทำให้สมบูรณ์
app.post('/checkLogin',async (req,res) => {
    // ถ้าเช็คแล้ว username และ password ถูกต้อง
    // return res.redirect('feed.html');
    // ถ้าเช็คแล้ว username และ password ไม่ถูกต้อง
    // return res.redirect('index.html?error=1')
    const { username, password } = req.body;

    const userDataPath = path.join(__dirname, 'js', 'userDB.json');
    fs.readFile(userDataPath, 'utf-8', (err, data) => {
        if (err) {
            console.error('Error reading userDB.json:', err);
            return res.redirect('index.html?error=1');
        }

        const users = JSON.parse(data);

        let isAuthenticated = false;
        for (let key in users) {
            if (users[key].username === username && users[key].password === password) {
                isAuthenticated = true;
                res.cookie('username', username);
                res.cookie('img', users[key].img);
                return res.redirect('feed.html');
            }
        }

        if (!isAuthenticated) {
            return res.redirect('index.html?error=1');
        }
    });
})

//ทำให้สมบูรณ์
const readJson = (file_name) => {
    return new Promise((resolve, reject) => {
        fs.readFile(file_name, 'utf8', (err, data) => {
            if (err) reject(err);
            else resolve(JSON.parse(data));
        });
    });
}

//ทำให้สมบูรณ์
const writeJson = (data,file_name) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(file_name, JSON.stringify(data, null, 2), 'utf8', (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}

//ทำให้สมบูรณ์
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
}

 app.listen(port, hostname, () => {
        console.log(`Server running at   http://${hostname}:${port}/`);
});
