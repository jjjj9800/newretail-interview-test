export default function Card({name, category, price, inStock}) {
  return <div className="card text-start">
    <div className="card" style={{width: '100%'}}>
      <div className="card-body">
        <h5 className="card-title">{name}</h5>
        <p className="card-text">
          <span className="d-block">[類別]: {category}</span>
          <span className="d-block">[價錢]: {price}</span>
          <span className="d-block">[庫存]: {inStock ? "是" : "否"}</span>
        </p>
      </div>
    </div>
  </div>
}