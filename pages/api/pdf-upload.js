import { PDFLoader } from 'langchain/document_loaders/fs/pdf';

export default async function handler(req, res) {
	if (req.method === 'GET') {
		console.log('Uploading book');
		/** STEP ONE: LOAD DOCUMENT */
		const { bookId } = req.query;
		const bookDb = {
			101: 'C:\\Users\\riyam\\AI\\openai-javascript-course\\data\\document_loaders\\naval-ravikant-book.pdf',
		};
		const bookPath = bookDb[bookId];
		if (!bookPath) {
			console.log(`Book with ID ${bookId} not found.`);
			return res.status(404).json({ error: 'Book not found' });
		}

		console.log(`Loading book from path: ${bookPath}`);
		const loader = new PDFLoader(bookPath);

		try {
			const docs = await loader.load();
			if (docs.length === 0) {
				console.log('No documents found.');
				return res.status(404).json({ error: 'No documents found' });
			}

			// Rest of the code follows...
		} catch (error) {
			console.error('Error loading documents:', error);
			return res.status(500).json({ error: 'Failed to load documents' });
		}
	} else {
		res.status(405).json({ message: 'Method not allowed' });
	}
}
