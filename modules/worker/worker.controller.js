const amqp = require('amqplib/callback_api');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

const Convert = require('../../models/convert');

exports.connect = async (req, res, next) => {
    try {
        amqp.connect('amqp://localhost',function(error0, connection) {
            if (error0) {
                throw error0;
            }
            connection.createChannel(function(error1, channel) {
                if (error1) {
                    throw error1;
                }
                const queue = 'task_queue';

                channel.assertQueue(queue, {
                    durable: true
                });
                channel.prefetch(1);

                res.status(200).json({message: `[*] Waiting for messages in ${queue}. To exit press CTRL+C`});
                console.log(`[*] Waiting for messages in ${queue}. To exit press CTRL+C`);

                channel.consume(queue, function(msg) {

                    let my_msg = msg.content.toString();
                    let obj = JSON.parse(my_msg);

                    let source = obj.source;
                    let fakeName = obj.fakeName;

                    //both variants return same result
                    // const result = path.join(__dirname, 'converted', `${fakeName}`);
                    const result = path.resolve('converted', `${fakeName}`);

                    ffmpeg(source)
                        .output(result)
                        .on('error', function(err) {
                            console.log('error: ', err);
                        })
                        .on('end', async function () {
                        const convert = await Convert.findOne({converted: fakeName});
                        convert.status = 'ended';
                        convert.save();

                        fs.unlink(source, (err) => {
                            if(err) {
                                console.log(err)
                            }
                            console.log(`${source} is deleted`);
                            console.log('task ended');
                        });

                        console.log(`${source} is converted`);
                    }).run();
                    setTimeout(function() {
                        channel.ack(msg);
                    }, 60000);
                }, {
                    noAck: false
                });
            });
        });
    } catch (e) {
        next(e);
    }
};
