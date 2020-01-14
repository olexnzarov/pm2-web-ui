import BaseButton from './BaseButton';

const traits = {
  online: {
    disabled: false,
    text: 'Restart',
    icon: 'fa-redo-alt',
    color: 'is-link',
  },
  stopping: null,
  launching: null,
  errored: null,
  stopped: null,
  ['one-launch-status']: null,
};

traits.stopped = { ...traits.online, disabled: true };
traits.errored = traits.stopped;
traits['one-launch-status'] = traits.stopped;
traits.stopping = traits.stopped;
traits.launching = traits.stopped;

export default function(props) { return <BaseButton {...props} traits={traits} /> };