export default function({ title, text, onRemove = null, ...props }) {
  return <article className="message is-danger" {...props}>
    <div className="message-header">
      <p>{title}</p>
      {
        onRemove &&
        <button className="delete" aria-label="delete" onClick={() => onRemove()}></button>
      }
    </div>
    <div className="message-body">
      {text}
    </div>
  </article>;
};