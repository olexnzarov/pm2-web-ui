import BaseButton from './BaseButton';

const traits = {
  stopped: {
    disabled: false,
    text: 'Start',
    icon: 'fa-play',
    color: 'is-success',
  },
  online: {
    disabled: false,
    text: 'Stop',
    icon: 'fa-stop',
    color: 'is-danger',
  },
  stopping: null,
  launching: null,
  errored: null,
  ['one-launch-status']: null,
};

traits.errored = traits.stopped;
traits['one-launch-status'] = traits.online;
traits.stopping = { ...traits.stopped, disabled: true };
traits.launching = { ...traits.online, disabled: true };

export default function(props) { return <BaseButton {...props} traits={traits} /> };