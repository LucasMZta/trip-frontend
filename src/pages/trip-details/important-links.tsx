import { Link2, Plus } from "lucide-react"
import { Button } from "../../components/button"
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../../lib/axios";
import { CreateLinkModal } from "./create-link-modal";

interface Links {
	id: string;
	title: string;
	url: string;
}

export const ImportantLinks = () => {

	const { tripId } = useParams();
	const [importantLinks, setImportantLinks] = useState<Links[]>([]);
	const [isCreateLinkModalOpen, setIsCreateLinkModalOpen] = useState(false);

	const openModalCreateLink = () => {
		setIsCreateLinkModalOpen(true);
	}
	const closeModalCreateLink = () => {
		setIsCreateLinkModalOpen(false);
	}

	useEffect(() => {
		api.get(`/trips/${tripId}/links`).then(response => setImportantLinks(response.data.links));
	}, [tripId]);

	return (
		<div className="space-y-6">
			<h2 className="text-xl font-semibold">Links Importantes</h2>
			{importantLinks.length > 0 ? (
				importantLinks.map(link => (
					<div key={link.id} className="space-y-5">
						<div className="flex items-center justify-between">
							<div className="space-y-1.5">
								<span className="block font-medium text-zinc-100">{link.title}</span>
								<a href={link.url} target="_blank" className="block font-xs text-zinc-400 truncate hover:text-zinc-200">{link.url}</a>
							</div>
							<Link2 className="text-zinc-400 size 5 flex-shrink-0" />
						</div>
					</div>
				))
			) : (
				<p className="text-zinc-500 text-sm text-center w-full">Nenhum link cadastrado no momento.</p>
			)}
			<Button variantColor="secondary" size="full" onClick={openModalCreateLink} >
				<Plus className='size-5' />
				Cadastrar novo link
			</Button>

			{isCreateLinkModalOpen &&
				<CreateLinkModal closeModalCreateLink={closeModalCreateLink} />
			}
		</div>
	)
}