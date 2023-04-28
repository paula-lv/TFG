const User = require('./auth.dao');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SECRET_KEY = 'secretkey123456';

exports.createUser = (req, res, next)=> {
    const newUser = {
        name: req.body.name, 
        email: req.body.email, 
        psw: bcrypt.hashSync(req.body.psw)
    }

    User.create (newUser, (err, user)=> {
        if(err && err.code == 11000) return res.status(409).send('El email ya existe');
        if (err) return res.status(500).send('Server error');
        const expiresIn = 24*60*60;
        const accessToken = jwt.sign({ id: user.id }, SECRET_KEY,  { expiresIn: expiresIn});

        const dataUser = {
            name: user.name,
            ameil: user.email,
            accessToken: accessToken,
            expiresIn: expiresIn
        }

        //response
        res.send({ dataUser });
    });
}

exports.loginUser = (req, res, next)=> {
    const userData = {
        email: req.body.email,
        psw: req.body.psw,
    }

    User.findOne({email: userData.email}, (err, user)=> {
        if (err) return res.status(500).send('Server error');
        if (!user) { //no existe el email
            res.status(409).send({message: 'Hubo un error'});
        } else {
            const resultPassword = bcrypt.compareSync(userData.psw, user.psw); //devuelve true si la psw coincide con bd
            if (resultPassword) {
                const expiresIn = 24*60*60;
                const accessToken = jwt.sign({id: user}, SECRET_KEY, {expiresIn: expiresIn});

                const dataUser = {
                    name: user.name,
                    ameil: user.email,
                    accessToken: accessToken,
                    expiresIn: expiresIn
                }

                res.send({dataUser});
            } else {
                //contraseña incorrecta
                res.status(409).send({message: 'Hubo un error'});
            }
        }
    })
}


/*const User = require('./auth.dao');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SECRET_KEY = 'secretkey123456';

const createUser = async(req, res) => {
    const newUser = {
        name: req.body.name, 
        email: req.body.email, 
        psw: req.body.psw
    }

    try {
        await User.create (newUser, (err, user)=> {
            if (err) return res.status(500).send('Server error');
            const expiresIn = 24*60*60;
            const accessToken = jwt.sign({ id: user.id }, SECRET_KEY,  { expiresIn: expiresIn});
    
            //response
            response.send({ user });
        });
    }  catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            error: 0,
            msg: 'Error en registro',
            token: ''
        });
    }
}

const loginUser =  async(req, res)=> {
    const userData = {
        email: req.body.email,
        psw: req.body.psw,
    }

    try {
        await User.findOne({email: userData.email}, (err, user)=> {
            if (err) return res.status(500).send('Server error');
            if (!user) { //no existe el email
                res.status(409).send({message: 'Hubo un error'});
            } else {
                const resultPassword = userData.psw; //devuelve true si la psw coincide con bd
                if (resultPassword) {
                    const expiresIn = 24*60*60;
                    const accessToken = jwt.sign({id: user}, SECRET_KEY, {expiresIn: expiresIn});
    
                    res.send({userData});
                } else {
                    //contraseña incorrecta
                    res.status(409).send({message: 'Hubo un error'});
                }
            }
        })
    }  catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            error: 0,
            msg: 'Error en login',
            token: ''
        });
    }
    
}

module.exports = { createUser, loginUser }

*/