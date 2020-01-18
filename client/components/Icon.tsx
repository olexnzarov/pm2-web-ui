export default function({ className = '', icon, ...props }) {
  return (
    <span key={icon} className={`icon ${className}`} {...props}>
      <i className={`fas ${icon}`}></i>
    </span>
  );
}