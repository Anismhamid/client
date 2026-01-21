import {FunctionComponent} from "react";
import {Modal, ModalHeader} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import handleRTL from "../../../locales/handleRTL";
import NewProductForm from "./NewProductForm";
import useAddProductFormik from "../../../hooks/useAddProductFormik";

interface AddProdutModalProps {
	show: boolean;
	onHide: Function;
}

const AddProdutModal: FunctionComponent<AddProdutModalProps> = ({show, onHide}) => {
	const {t} = useTranslation();
	const {formik, imageFile, setImageFile, imageData, setImageData} =
		useAddProductFormik();

	const dir = handleRTL();
	return (
		<Modal style={{zIndex:2000}} dir={dir} show={show} onHide={() => onHide()} centered>
			<ModalHeader closeButton>
				<h1 className='display-6 fw-bold text-center'>
					{t("modals.addProductModal.title")}
				</h1>
			</ModalHeader>
			<Modal.Body className='rounded d-flex justify-content-center align-items-center'>
				<div className='container '>
					<NewProductForm
						formik={formik}
						imageFile={imageFile}
						setImageFile={setImageFile}
						imageData={imageData}
						setImageData={setImageData}
						onHide={() => onHide()}
					/>
				</div>
			</Modal.Body>
		</Modal>
	);
};

export default AddProdutModal;
