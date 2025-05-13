import "jspdf";

declare module "jspdf" {
	interface jsPDF {
		addFileToVFS(filename: string, filecontent: string): void;
		addFont(postScriptName: string, fontName: string, fontStyle: string): void;
	}
}
