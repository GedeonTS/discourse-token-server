const express = require('express');
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');

const app = express();
const PORT = 3000;

// const APP_ID = process.env.APP_ID;
// const APP_CERTIFICATE = process.env.APP_CERTIFICATE;

const APP_ID='822488d93b924e8dbcf45dd5b3950d9f'
const APP_CERTIFICATE='002f4e252edc42ebb267d13a9a4e13fc'




const nocache = (req, res, next) => {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
}

const generateAccessToken = (req, res) => {
    //set response header
    res.header("Access-Control-Allow-Origin", "*");
    //get channel name from request
    const channelName = req.query.channelName;
    if (!channelName) {
        return res.status(400).json({ 'errot': 'channel name is required' });
    }
    //get uid from request
    let uid = req.query.uid;
    if (!uid || uid === '') {
        uid = 0;
    }

    //get role from request
    let role = RtcRole.SUBSCRIBER;
    if (req.query.role === 'publisher') {
        role = RtcRole.PUBLISHER;
    }

    //get expire time from request
    let expireTime = req.query.expireTime;
    if (!expireTime || expireTime === '') {
        expireTime = 3600;
    } else {
        expireTime = parseInt(expireTime, 10);
    }

    // calculate privilege expire time
    const currentTime = Math.floor(Date.now() / 1000);
    const privilegeExpireTime = currentTime + expireTime;

    //build token
    const token = RtcTokenBuilder.buildTokenWithUid(APP_ID, APP_CERTIFICATE, channelName, uid, role, privilegeExpireTime);

    //return token

    return res.status(200).json({ 'token': token });

}

app.get('/access_token', nocache, generateAccessToken);

app.listen(PORT, () => console.log(`Listening on ${PORT}`));