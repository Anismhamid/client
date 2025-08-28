// components/JsonLd.tsx
import {FunctionComponent} from "react";

interface JsonLdProps {
	data: object;
}

const JsonLd: FunctionComponent<JsonLdProps> = ({data}) => (
	<script
		type='application/ld+json'
		dangerouslySetInnerHTML={{__html: JSON.stringify(data)}}
	/>
);

export default JsonLd;
