export function CartError() {
  return (
    <div className="cart-error">
      <p>Failed to load cart</p>
      <button onClick={() => window.location.reload()} className="retry-button">
        Try Again
      </button>
    </div>
  );
}
