import React from "react";
import Modal from "react-modal";
import Order1 from "./Order1";
import Order2 from "./Order2";

class AddProperty extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      content: "",
      img_content: "",
      property_type: "",
      bedrooms: 0,
      price: 0,
      address: "",
      isOnOrder2: false
    };
  }
  onNext = (property_type, bedrooms, address) => {
    this.setState({ property_type, bedrooms, address });
    if (property_type && bedrooms && address)
      this.setState({ isOnOrder2: true });
    else alert("All fields are required.");
  };
  onAdd = (rental_type, img_content, price, content) => {
    this.setState({
      rental_type,
      img_content,
      price,
      content,
      isOnOrder2: false
    });
    if (rental_type && price && content)
      this.addProperty(rental_type, price, content);
    else alert("All fields are required.");
  };
  addProperty = (rental_type, price, content) => {
    const { toggleModal } = this.props;
    const { property_type, bedrooms, address } = this.state;
    this.setState({
      rental_type: "",
      price: "",
      content: "",
      property_type: "",
      bedrooms: "",
      address: ""
    });
    const address_arr = address.value.split(", ");
    const first_address_line = address_arr[0];
    const second_address_line = address_arr[1];
    const third_address_line = address_arr[2];
    const area =
      !address_arr[3] && !address_arr[4]
        ? ""
        : address_arr[3] + " " + address_arr[4];
    const town = address_arr[5];
    const county = address_arr[6];
    console.log("address", address.value);
    let property_address = {
      first_address_line,
      second_address_line,
      third_address_line,
      area,
      town,
      county
    };
    const property = {
      property_type,
      rental_type,
      price,
      bedrooms,
      property_address,
      content
    };
    toggleModal();
    console.log("property", property);
    const { addProperty } = this.props;
    addProperty(property);
  };
  render() {
    const { isOnOrder2 } = this.state;
    const { showModal, toggleModal } = this.props;
    return (
      <Modal
        closeTimeoutMS={200}
        isOpen={showModal}
        contentLabel="modal"
        onRequestClose={toggleModal}
      >
        {!isOnOrder2 && (
          <Order1
            onNext={(property_type, bedrooms, address) =>
              this.onNext(property_type, bedrooms, address)
            }
            onClose={toggleModal}
            {...this.state}
          />
        )}
        {isOnOrder2 && (
          <Order2
            onAdd={(rental_type, img_content, price, content) =>
              this.onAdd(rental_type, img_content, price, content)
            }
            onClose={toggleModal}
            onBack={() => this.setState({ isOnOrder2: false })}
          />
        )}
      </Modal>
    );
  }
}
export default AddProperty;
