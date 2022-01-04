const path = require('path');
const amqp = require("amqplib/callback_api");

const generateString = require('../../middlewares/randomName');
const Convert = require('../../models/convert');

exports.convert = async (req, res) => {

    const fakeName = generateString(10);
    const source = path.resolve(`audioFiles/${req.file.filename}`);

    // saving source video name, converted video name and Status
    const convert = await new Convert({
        source: path.basename(source),
        converted: `${fakeName}.m3u8`,
        status: "processing",
    });

    res.status(200).json({message: `your converted video name is ${fakeName}.m3u8`});
    convert.save();

    amqp.connect('amqp://localhost', function(error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }
            const queue = 'task_queue';

            let msg =  {
                source: source,
                fakeName: `${fakeName}.m3u8`,
                status: convert.status,
            };
            msg = JSON.stringify(msg);

            channel.assertQueue(queue, {durable: true});
            channel.sendToQueue(queue, Buffer.from(msg), {persistent: true});
            console.log(" [x] Sent '%s'", msg);
        });
        setTimeout(function() {
            // connection.close();
            // process.exit(0)
        }, 1000);
    });
};
