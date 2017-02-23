const Pusher = require('pusher');
const rp = require('request-promise');

let pusherInstance = null;
const getPusherInstance = () => {
  return pusherInstance || new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_APP_KEY,
    secret: process.env.PUSHER_APP_SECRET,
    encrypted: true
  });
}

const getWordsmithPostOptions = (data) => {
  return options = {
    method: 'POST',
    uri: `https://api.automatedinsights.com/v1/projects/${process.env.WORDSMITH_PROJECT_NAME}/templates/${process.env.WORDSMITH_TEMPLATE_NAME}/outputs`,
    body: {
      data
    },
    json: true,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.WORDSMITH_API_KEY}`,
      'User-Agent': 'I-have-a-cat-sitting-on-my-back'
    }
  };
}


/**
 * Response helpers.
 */
const APIResponse = {

  formatData(data) {
    // Dates are coming in this format. 2015-01-02T05:00:00.000Z
    // Currently need to transform into this format.
    let formattedDate = data.date.split('T')[0];
    formattedDate = formattedDate.split('-');
    return Object.assign({}, data, {
      date: `${formattedDate[1]}/${formattedDate[2]}/${formattedDate[0]}`
    });
  },

  /**
   * Triggered via POST to /api/update
   *
   * @param  {Object} req
   * @param  {Object} res
   */
  onUpdate(req, res) {
    const options = getWordsmithPostOptions(this.formatData(req.body));
    rp(options)
      .then(function(parsedBody) {
        getPusherInstance().trigger(
          process.env.PUSHER_CHANNEL,
          process.env.PUSHER_EVENT, {
            wordsmithData: parsedBody,
            sheetsData: req.body
          });
        res.send({
          success: true,
          wordsmithData: parsedBody,
          sheetsData: req.body
        });
      })
      .catch(function(err) {
        console.error(err);
        res.send({
          success: false,
          body: req.body,
          error: err
        });
      });
  }
};

module.exports = APIResponse;
