import './styles/base.scss';

// eslint-disable-next-line no-undef
const pusher = new Pusher(APP_CONFIG.PUSHER_APP_KEY, {
  encrypted: true,
});

const channel = pusher.subscribe(APP_CONFIG.PUSHER_CHANNEL);
channel.bind(APP_CONFIG.PUSHER_EVENT, (data) => {
  console.info(data);
  document.querySelector('.story').innerHTML = data.wordsmithData.data.content;
});
