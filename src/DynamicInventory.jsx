import { useState, useRef, useEffect } from "react";
import "./dynamicInventory.css";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";

function DynamicInventory() {
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [list, setList] = useState(() => {
    const storedList = localStorage.getItem("inventoryList");
    return storedList ? JSON.parse(storedList) : [];
  });
  const [toggle, setToggle] = useState({ show: false, id: null });
  const [filterCategory, setFilterCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState(null); // Default is no sorting
  const editRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("inventoryList", JSON.stringify(list));
  }, [list]);

  const addItem = () => {
    if (itemName && category && quantity) {
      setList([
        ...list,
        { name: itemName, category, quantity: parseInt(quantity, 10) },
      ]);
      resetInputs();
    }
  };

  const deleteItem = (id) => {
    const updatedList = list.filter((_, index) => index !== id);
    setList(updatedList);
  };

  const editItem = (id) => {
    const item = list[id];
    setItemName(item.name);
    setCategory(item.category);
    setQuantity(item.quantity);
    setToggle({ show: true, id });
    editRef.current.focus();
  };

  const updateItem = () => {
    if (toggle.id !== null) {
      const updatedList = [...list];
      updatedList[toggle.id] = {
        name: itemName,
        category,
        quantity: parseInt(quantity, 10),
      };
      setList(updatedList);
      setToggle({ show: false, id: null });
      resetInputs();
    }
  };

  const resetInputs = () => {
    setItemName("");
    setCategory("");
    setQuantity("");
  };

  const filteredList =
    filterCategory === "All"
      ? list
      : list.filter((item) => item.category === filterCategory);

  const sortedList = sortOrder
    ? [...filteredList].sort((a, b) =>
        sortOrder === "asc" ? a.quantity - b.quantity : b.quantity - a.quantity
      )
    : filteredList; // No sorting if sortOrder is null

  return (
    <div className="mainBody">
      <div className="inputHeader">
        <div className="inputSection">
          <input
            type="text"
            placeholder="Item Name"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            ref={editRef}
          />
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          {toggle.show ? (
            <button onClick={updateItem}>Update</button>
          ) : (
            <button onClick={addItem}>+ Add</button>
          )}
        </div>
      </div>
      <div className="filterSortSection">
        <select onChange={(e) => setFilterCategory(e.target.value)}>
          <option value="All">All Categories</option>
          {Array.from(new Set(list.map((item) => item.category))).map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <select
          value={sortOrder || "default"} // Default option for unsorted
          onChange={(e) => setSortOrder(e.target.value === "default" ? null : e.target.value)}
          className="sortDropdown"
        >
          <option value="default">No Sorting</option>
          <option value="asc">Sort by Quantity (Ascending)</option>
          <option value="desc">Sort by Quantity (Descending)</option>
        </select>
      </div>
      <div className="listBody">
        {sortedList.length > 0 ? (
          <table className="inventoryTable">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedList.map((item, index) => (
                <tr
                  key={index}
                  className={item.quantity < 10 ? "lowStock" : ""}
                >
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.quantity}</td>
                  <td>
                    <button onClick={() => editItem(index)}>
                      <MdEdit />
                    </button>
                    <button onClick={() => deleteItem(index)}>
                      <MdDelete />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <h5>Inventory is Empty</h5>
        )}
      </div>
    </div>
  );
}

export default DynamicInventory;
