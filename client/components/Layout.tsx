import Navbar from './Navbar';

export default function({ children }) {
  return (
    <div>
      <Navbar />
      <section className="section">
        {children}
      </section>
    </div>
  );
};