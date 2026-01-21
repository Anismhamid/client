// ErrorBoundary.tsx
import {Component, ErrorInfo, ReactNode} from "react";
import {Box, Typography, Button} from "@mui/material";

interface Props {
	children: ReactNode;
}

interface State {
	hasError: boolean;
	error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
	public state: State = {
		hasError: false,
	};

	public static getDerivedStateFromError(error: Error): State {
		return {hasError: true, error};
	}

	public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error("Uncaught error:", error, errorInfo);
	}

	public render() {
		if (this.state.hasError) {
			return (
				<Box component={"main"} sx={{p: 4, textAlign: "center"}}>
					<Typography variant='h5' color='error' gutterBottom>
						حدث خطأ ما
					</Typography>
					<Typography variant='body1' color='text.secondary' paragraph>
						{this.state.error?.message || "حدث خطأ غير متوقع"}
					</Typography>
					<Button
						variant='contained'
						onClick={() => this.setState({hasError: false})}
					>
						حاول مرة أخرى
					</Button>
				</Box>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
