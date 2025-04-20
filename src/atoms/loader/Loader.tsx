import {FunctionComponent} from "react";
import Style from "./loader.module.css";

interface LoaderProps {}

const Loader: FunctionComponent<LoaderProps> = () => {
	return (
		<main className={Style.main}>
			<div className={Style.loader}></div>
		</main>
	);
};

export default Loader;
