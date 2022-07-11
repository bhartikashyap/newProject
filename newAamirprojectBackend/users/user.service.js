const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');

module.exports = {
    authenticate,
    create,
    update
};

function compareString(string1,string2){

   // if()
}

async function authenticate({ email, password }) {
    const user = await db.User.findOne({ where: { email } });

// console.log(compare(user.password,password))
    // if (!user || !(await bcrypt.compare(password, user.password)))
    if (!user || !password  || (password.toUpperCase() != user.password.toUpperCase()))
        throw 'Username or password is incorrect';

    // authentication successful
    const token = jwt.sign({ sub: user.id }, config.secret, { expiresIn: '7d' });
    let userData = user.get();
    let data = {
        "userId": userData.id,
        "firstName": userData.firstName,
        "lastName": userData.lastName,
        "email": userData.email,
        "status": userData.status,
        "regDate": userData.createdAt,
        "nationality": userData.nationality,
    }
    return { ...omitHash(data), token };
}


async function create(params) {
    // validate
    if (await db.User.findOne({ where: { email: params.email } })) {
        throw 'Username "' + params.email + '" is already taken';
    }

    // hash password
    // if (params.password) {
    //     params.password = await bcrypt.hash(params.password, 10);
    // }

    // save user
    await db.User.create(params);
   this.authenticate(params.email,params.password);
}

async function update(params,loggedInuser) {
    const user = await db.User.scope().findOne({ where: { email: loggedInuser.email } });
    console.log(user)
    // validate
    //  const usernameChanged = params.email && user.email !== params.email;
    // if (!params.paswword) {
    //     throw 'Username or password is incorrect';
    //     // throw 'Username "' + params.email + '" is already taken';
    // }

    // compare password if it was entered
    // if (params.password) {
    //     params.password = await bcrypt.hash(params.password, 10);
    // }
    console.log( params.password,user.password)
    if (!user ||  !params.password  || (params.password.toUpperCase() != user.password.toUpperCase()))
       throw 'Password is incorrect';
    // if (params.password) {
    //     params.password = await bcrypt.hash(params.password, 10);
    // }
    console.log(params)
    // if (params.newpassword) {
    //     params.newpassword = await bcrypt.hash(params.newpassword, 10);
    // }
    // copy params to user and save
    params.password = params.newpassword;
    Object.assign(user, params);
    console.log(user)
    await user.save();


    return omitHash(user.get());
}


// helper functions

async function getUser(email) {
    const user = await db.User.findOne(email);
    if (!user) throw 'User not found';
    return user;
}

function omitHash(user) {
    const { hash, ...userWithoutHash } = user;
    return userWithoutHash;
}