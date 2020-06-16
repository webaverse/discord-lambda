// globalThis.window = globalThis;
// globalThis.self = globalThis;

// const Discord = require('./discord.12.0.1.min.js');
const Discord = require('discord.js');

function parseQuery(queryString) {
    var query = {};
    var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split('=');
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return query;
}

const discordConfig = require('config.json');
const client = new Discord.Client();
const readyPromise = client.login(discordConfig.token)
  .then(() => client.channels.fetch(discordConfig.channelId));

client.on('error', err => {
  console.warn(err.stack);
});

exports.handler = async event => {
  const channel = await readyPromise;
  // const {pathname, search} = new URL(request.url);
  console.log('got event', event);
  let {queryStringParameters: {t}, body, isBase64Encoded} = event;
  if (isBase64Encoded) {
    body = Buffer.from(body, 'base64').toString('utf8');
  }
  if (t === 'postMessage') {
    try {
      await channel.send(body);
    } catch(err) {
      console.warn(err.stack);
    }
    /* if (typeof data.text === 'string') {
      channel.send(data.text);
    } else if (typeof data.attachment === 'string') {
      const filename = data.attachment;
      if (discordAttachmentBuffer) {
        channel.send(new Discord.Attachment(discordAttachmentBuffer, filename));
        discordAttachmentBuffer = null;
      } else {
        // console.log('prepare for attachment', data.attachment);
        discordAttachmentSpec = {
          channel,
          filename,
        };
      } */

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': '*',
      },
      body: 'ok',
    };
  } else if (t === 'postAttachment') {
    const attachment = new Discord.MessageAttachment(body);
    try {
      await channel.send('', attachment);
    } catch(err) {
      console.warn(err.stack);
    }
    /* if (typeof data.text === 'string') {
      channel.send(data.text);
    } else if (typeof data.attachment === 'string') {
      const filename = data.attachment;
      if (discordAttachmentBuffer) {
        channel.send(new Discord.Attachment(discordAttachmentBuffer, filename));
        discordAttachmentBuffer = null;
      } else {
        // console.log('prepare for attachment', data.attachment);
        discordAttachmentSpec = {
          channel,
          filename,
        };
      } */

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': '*',
      },
      body: 'ok',
    };
  } else {
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': '*',
      },
      body: 'path not found',
    };
  }
}
