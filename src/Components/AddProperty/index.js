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
      isOnOrder2: false,
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
      isOnOrder2: false,
    });
    if (rental_type && price && content)
      this.addProperty(rental_type, price, content);
    else alert("All fields are required.");
  };
  addProperty = (rental_type, price, content) => {
    const { toggleModal } = this.props;
    const { property_type, bedrooms, address } = this.state;
    const property = {
      property_type:property_type.value,
      rental_type:rental_type.value,
      price,
      bedrooms,
      address:address.value,
      content
    };
    toggleModal();
    console.log("property", property);
    const { addProperty } = this.props;
    addProperty(property);
  };

  onToggle = () => {
    const { toggleModal } = this.props;
    this.setState({
      isOnOrder2: false,
    });

    toggleModal();
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
        <Order1
          onNext={(property_type, bedrooms, address) =>
            this.onNext(property_type, bedrooms, address)
          }
          onClose={this.onToggle}
          show={!isOnOrder2}
        />
        {isOnOrder2 && (
          <Order2
            onAdd={(rental_type, img_content, price, content) =>
              this.onAdd(rental_type, img_content, price, content)
            }
            onClose={this.onToggle}
            onBack={() => this.setState({ isOnOrder2: false })}
          />
        )}
      </Modal>
    );
  }
}
export default AddProperty;
