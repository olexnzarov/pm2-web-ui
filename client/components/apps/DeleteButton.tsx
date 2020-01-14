import BaseButton from './BaseButton';

const traits = {
  stopped: {
    disabled: false,
    text: 'Delete',
    icon: 'fa-trash-alt',
    color: 'is-dark',
  },
  stopping: null,
  launching: null,
  errored: null,
  online: null,
  ['one-launch-status']: null,
};

traits.errored = traits.stopped;

traits.online = { ...traits.stopped, disabled: true };
traits['one-launch-status'] = traits.online;
traits.stopping = traits.online;
traits.launching = traits.online;

export default function(props) { return <BaseButton {...props} traits={traits} /> };