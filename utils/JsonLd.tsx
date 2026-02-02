import React from "react";
import {memo, FunctionComponent} from "react";

interface JsonLdProps {
	data: Record<string, unknown>;
}

const JsonLd: FunctionComponent<JsonLdProps> = ({data}) => (
	<script
		type='application/ld+json'
		dangerouslySetInnerHTML={{__html: JSON.stringify(data)}}
	/>
);

export default memo(JsonLd);
