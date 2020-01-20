export default function({ columns, ...props }) {
  const elements = columns.map(col => <th key={col}>{col}</th>);
  return <thead {...props}><tr>{elements}</tr></thead>;
};