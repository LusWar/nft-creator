import React, {useState} from 'react';
import {
    AppBar,
    Button,
    Grid,
    Container,
    Link,
    Toolbar,
    SvgIcon,
    CssBaseline,
    Typography,
    makeStyles,
    Divider,
    Box,
    CircularProgress,
    Dialog,
    CardMedia,
} from "@material-ui/core";
import ImageRoundedIcon from '@material-ui/icons/ImageRounded';
import Web3 from "web3";
import Web3Modal from "web3modal";
import pinataSDK from "@pinata/sdk";
import axios from "axios";

const pinata = pinataSDK('5a6750d93bb9861807b8', 'bbc4f09a087bbfb3bf7e242f2d4c4509b22e187a3a5765c004bec656de91e5ce');
const nftContractAddress = "0x11C3d9B814E2350c4ba4122A404EBFE89421F5f7";
const nftContractABI = [
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_uri",
                "type": "string"
            }
        ],
        "name": "addItem",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "_owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "_approved",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "_tokenId",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "_owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "_operator",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "_approved",
                "type": "bool"
            }
        ],
        "name": "ApprovalForAll",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_approved",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_tokenId",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_tokenId",
                "type": "uint256"
            }
        ],
        "name": "safeTransferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_tokenId",
                "type": "uint256"
            },
            {
                "internalType": "bytes",
                "name": "_data",
                "type": "bytes"
            }
        ],
        "name": "safeTransferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_operator",
                "type": "address"
            },
            {
                "internalType": "bool",
                "name": "_approved",
                "type": "bool"
            }
        ],
        "name": "setApprovalForAll",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "_from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "_to",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "_tokenId",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_tokenId",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "CANNOT_TRANSFER_TO_ZERO_ADDRESS",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_tokenId",
                "type": "uint256"
            }
        ],
        "name": "getApproved",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_operator",
                "type": "address"
            }
        ],
        "name": "isApprovedForAll",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "internalType": "string",
                "name": "_name",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "NOT_CURRENT_OWNER",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_tokenId",
                "type": "uint256"
            }
        ],
        "name": "ownerOf",
        "outputs": [
            {
                "internalType": "address",
                "name": "_owner",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes4",
                "name": "_interfaceID",
                "type": "bytes4"
            }
        ],
        "name": "supportsInterface",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "internalType": "string",
                "name": "_symbol",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_tokenId",
                "type": "uint256"
            }
        ],
        "name": "tokenURI",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://kovan.etherscan.io">
                Kovan TestNet
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

function HomeIcon(props) {
    return (
        <SvgIcon {...props} xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 48 48" width="96px" height="96px">
            <path fill="#9fa8da" d="M11 24L25 2 39 24 25 32z"/>
            <path fill="#7986cb" d="M25 2L39 24 25 32z"/>
            <path fill="#9fa8da" d="M11 27L25 35 39 27 25 46z"/>
            <path fill="#7986cb" d="M25 35L39 27 25 46zM11 24L25 18 39 24 25 32z"/>
            <path fill="#5c6bc0" d="M25 18L39 24 25 32z"/>
        </SvgIcon>
    );
}

const useStyles = makeStyles((theme) => ({
    icon: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(8, 0, 3),
    },
    contentTop: {
        marginTop: theme.spacing(0),
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
    },
    content: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
    },
    bytecodeText: {
        backgroundColor: theme.palette.background.default,
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
    },
    contentBottom: {
        paddingTop: theme.spacing(2),
    },
    cardGrid: {
        backgroundColor: theme.palette.background.paper,
        paddingBottom: theme.spacing(80),
    },
    upload: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    input: {
        display: 'none',
    },
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    footer: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(6),
    },
    label: {
        textTransform: 'none',
    },
}));

export default function Album() {
    const classes = useStyles();
    const providerOptions = {};
    const web3Modal = new Web3Modal({
        network: "kovan", // optional
        cacheProvider: true, // optional
        providerOptions // required
    });

    // deploy contract state
    const [calling, setCalling] = useState(false);

    // connect Web3
    const [accounts, setAccounts] = useState([]);
    const [provider, setProvider] = useState(null);
    const [networkError, setNetworkError] = useState("");
    const [networkState, setNetworkState] = useState(false);

    // save image
    const [uploadState, setUploadState] = useState(false);
    const [uploadError, setUploadError] = useState("");
    const [upImage, setUpImage] = useState(null);
    const [imagePath, setImagePath] = useState("");
    const [saveCalling, setSaveCalling] = useState(false);

    const saveImage = ({ target }) => {
        try {
            setCalling(true);
            setSaveCalling(true);
            const fileReader = new FileReader();
            if (target.accept.includes('image')) {
                setImagePath(target.files[0].name);
                console.log(target.files[0].name);
                fileReader.readAsDataURL(target.files[0]);
                fileReader.onload = (e) => {
                    setUpImage(e.target.result);
                    console.log(e.target.result)
                };
            }
            setUploadState(true);
            setSaveCalling(false)
            setCalling(false);
        } catch (err) {
            setUploadState(false);
            const error = err.message;
            setUploadError("Error: " + error);
            console.log(err.message);
            setSaveCalling(false)
            setCalling(false);
        }
    };

    // show image
    const [openImage, setOpenImage] = React.useState(false);
    const handleImageOpen = () => {
        setOpenImage(true);
    };
    const handleImageClose = () => {
        setOpenImage(false);
    };

    // upload to ipfs
    const [ipfsState, setIpfsState] = useState(false);
    const [ipfsError, setIpfsError] = useState("");
    const [ipfsHash, setIpfsHash] = useState("");
    const [ipfsCalling, setIpfsCalling] = useState(false);

    const uploadToIPFS = async () => {
        try {
            setCalling(true);
            setIpfsCalling(true);
            const imageJson = {
                "image": upImage
            }
            const result = await pinata.pinJSONToIPFS(imageJson);
            setIpfsHash(result['IpfsHash']);
            console.log(result['IpfsHash']);
            setIpfsState(true);
            setIpfsCalling(false);
            setCalling(false);
        } catch (err) {
            setIpfsState(false);
            const error = err.message;
            setIpfsError("Error: " + error);
            console.log(err.message);
            setIpfsCalling(false);
            setCalling(false);
        }
    };

    // create nft
    const [nftState, setNftState] = useState(false);
    const [nftError, setNftError] = useState("");
    const [nftId, setNftId] = useState("");
    const [nftTxHash, setNftTxHash] = useState("");
    const [nftCalling, setNftCalling] = useState(false);
    const createNFT = async () => {
        try {
            setCalling(true);
            setNftCalling(true);
            setUri("");
            setQImage(null);
            const uri = "https://ipfs.io/ipfs/" + ipfsHash;
            const web3 = new Web3(provider);
            const nftContract = new web3.eth.Contract(nftContractABI, nftContractAddress);
            const receipt = await nftContract.methods.addItem(uri)
                .send({from: accounts[0]});
            setNftTxHash(receipt['transactionHash'])
            console.log(receipt['transactionHash']);
            setNftId(receipt['events']['Transfer']['returnValues']['_tokenId']);
            console.log(receipt['events']['Transfer']['returnValues']['_tokenId']);
            setNftState(true);
            setNftCalling(false);
            setCalling(false);
        } catch (err) {
            setNftState(false);
            const error = err.message;
            setNftError("Error: " + error);
            console.log(err.message);
            setNftCalling(false);
            setCalling(false);
        }
    };

    // query uri
    const [uriState, setUriState] = useState(false);
    const [uriError, setUriError] = useState("");
    const [uri, setUri] = useState("");
    const [uriCalling, setUriCalling] = useState(false);
    const [qImage, setQImage] = useState(null);
    const queryURI = async () => {
        try {
            setCalling(true);
            setUriCalling(true);
            const web3 = new Web3(provider);
            const nftContract = new web3.eth.Contract(nftContractABI, nftContractAddress);
            const tUri = await nftContract.methods.tokenURI(nftId).call();
            setUri(tUri);
            console.log(tUri);
            const config = {
                method: 'get',
                url: tUri,
                headers: { }
            };
            const result = await axios(config);
            const image = result.data['image'];
            setQImage(image);
            console.log(image);
            setUriState(true);
            setUriCalling(false);
            setCalling(false);
        } catch (err) {
            setUriState(false);
            const error = err.message;
            setUriError("Error: " + error);
            console.log(err.message);
            setUriCalling(false);
            setCalling(false);
        }
    };

    // Init state
    function initState() {
        web3Modal.clearCachedProvider();
        setProvider(null);
        setAccounts([]);
        setUpImage(null);
        setImagePath("");
        setIpfsHash("");
        setNftTxHash("");
        setUri("");
        setQImage(null);
        setNftId("");
        setUploadError("");
        setIpfsError("");
        setNftError("");
        setUriError("");
        setNetworkError("");
        setUploadState(false);
        setIpfsState(false);
        setNftState(false);
        setUriState(false);
        setNetworkState(false);
    }

    // connect Web3
    const connectWeb3 = async() => {
        try {
            initState();
            const provider = await web3Modal.connect();
            const web3 = new Web3(provider);
            const chainId = await web3.eth.getChainId();
            if(chainId !== 42) {
                initState();
                setNetworkError("Please switch to Kovan Testnet!")
                return;
            }
            setProvider(provider);
            setNetworkState(true);
            console.log(provider);
            if (provider) {
                if (provider.on) {
                    provider.on("accountsChanged", (accounts) => {
                        console.log(accounts);
                        setAccounts(accounts);
                    });
                    provider.on("chainChanged", (chainId) => {
                        initState();
                        setNetworkError("Please switch to Kovan Testnet!")
                        console.log(chainId);
                    });
                    provider.on("connect", (info) => { // : { chainId: number }
                        console.log(info);
                    });
                    provider.on("disconnect", (error) => {  // : { code: number; message: string }
                        console.log(error);
                    });
                }
                const accounts = await web3.eth.getAccounts();
                setAccounts(accounts);
            }
        } catch (err) {
            console.log(err.message);
        }
    }

    // disconnect Web3
    const disconnectWeb3 = async() => {
        try {
            if (provider.close) {
                await provider.close();
            }
            initState();
        } catch (err) {
            console.log(err.message);
        }
    }


    return (
        <React.Fragment>
            <CssBaseline />
            <AppBar position="static">
                <Toolbar>
                    <HomeIcon className={classes.icon} />
                    <Typography variant="subtitle1" className={classes.title}>
                        Ethereum Tools
                    </Typography>
                    {!networkState &&
                        <Box fontWeight="fontWeightBold" fontSize={14} color="red">
                            {networkError}
                        </Box>
                    }
                    <Box className={classes.title}></Box>
                    {!provider && <Button edge="end" variant="outlined" size="small" color="inherit" onClick={connectWeb3}>Connect Metamask</Button>}
                    {provider && <Button edge="end" variant="outlined" size="small" color="inherit" onClick={disconnectWeb3}>{accounts[0]}</Button>}
                </Toolbar>
            </AppBar>
            <main>
                {/* Hero unit */}
                <div className={classes.heroContent}>
                    <Container fixed>
                        <Typography component="h4" variant="h5" color="textPrimary">
                            NFT Creator
                        </Typography>
                    </Container>
                </div>
                {/* End hero unit */}
                <div>
                    <Container fixed>
                        <Divider variant="fullWidth" />
                    </Container>
                </div>
                {provider &&
                    <div className={classes.cardGrid}>
                        <Container>
                            <Grid className={classes.contentTop}>
                                <Box fontWeight="fontWeightBold" fontSize={14} color="textPrimary">
                                    [Step 1] Import An Image:
                                </Box>
                            </Grid>
                            <Grid container className={classes.content} spacing={2} alignItems="center">
                                <Grid item>
                                    <input
                                        accept="image/*"
                                        className={classes.input}
                                        id="contained-button-file"
                                        multiple
                                        onChange={saveImage}
                                        type="file"
                                    />
                                    <label htmlFor="contained-button-file">
                                        <Button size="small" variant="contained" color="primary" component="span"
                                                disabled={calling}>
                                            Import Image
                                        </Button>
                                    </label>
                                </Grid>
                                <Grid item>
                                    {saveCalling && (
                                        <CircularProgress size={30}/>
                                    )}
                                    {uploadState && !saveCalling && (
                                        <div>
                                            <Button className={classes.label} variant="outlined" size="small"
                                                    onClick={handleImageOpen} startIcon={<ImageRoundedIcon/>}>
                                                {imagePath}
                                            </Button>
                                            <Dialog
                                                onClose={handleImageClose}
                                                open={openImage}
                                                ria-labelledby="customized-dialog-title"
                                            >
                                                <CardMedia component='img' image={`${upImage}`}/>
                                            </Dialog>
                                        </div>
                                    )}
                                    {!uploadState && !saveCalling && (
                                        <Box fontWeight="fontWeightBold" fontSize={14} color="red">
                                            {uploadError}
                                        </Box>
                                    )}
                                </Grid>

                            </Grid>
                            <Grid className={classes.contentTop}>
                                <Box fontWeight="fontWeightBold" fontSize={14} color="textPrimary">
                                    [Step 2] Upload To IPFS:
                                </Box>
                            </Grid>
                            <Grid container className={classes.content} spacing={2} alignItems="center">
                                <Grid item>
                                    <Button size="small" variant="contained" color="primary" onClick={uploadToIPFS}
                                            disabled={calling}>
                                        Upload IPFS
                                    </Button>
                                </Grid>
                                <Grid item>
                                    {ipfsCalling && (
                                        <CircularProgress size={15}/>
                                    )}
                                    {ipfsState && !ipfsCalling && (
                                        <Box fontWeight="fontWeightBold" fontSize={14} color="green">
                                            {ipfsHash}
                                        </Box>
                                    )}
                                    {!ipfsState && !ipfsCalling && (
                                        <Box fontWeight="fontWeightBold" fontSize={14} color="red">
                                            {ipfsError}
                                        </Box>
                                    )}
                                </Grid>
                            </Grid>
                            <Grid className={classes.contentTop}>
                                <Box fontWeight="fontWeightBold" fontSize={14} color="textPrimary">
                                    [Step 3] Create A NFT:
                                </Box>
                            </Grid>
                            <Grid container className={classes.content} spacing={2} alignItems="center">
                                <Grid item>
                                    <Button size="small" variant="contained" color="primary" onClick={createNFT}
                                            disabled={calling}>
                                        Create NFT
                                    </Button>
                                </Grid>

                                <Grid item>
                                    {nftCalling && (
                                        <CircularProgress size={15}/>
                                    )}
                                    {nftState && !nftCalling && (
                                        <Grid>
                                            <Box item fontWeight="fontWeightBold" fontSize={14} color="green">
                                                ID: {nftId} Tx:
                                                <a href={"https://kovan.etherscan.io/tx/" + nftTxHash} target="_blank"
                                                   rel="noreferrer">{"https://kovan.etherscan.io/tx/" + nftTxHash} </a>
                                            </Box>
                                        </Grid>
                                    )}
                                    {!nftState && !nftCalling && (
                                        <Box fontWeight="fontWeightBold" fontSize={14} color="red">
                                            {nftError}
                                        </Box>
                                    )}
                                </Grid>
                            </Grid>
                            <Grid className={classes.contentTop}>
                                <Box fontWeight="fontWeightBold" fontSize={14} color="textPrimary">
                                    [Step 4] Query NFT URI:
                                </Box>
                            </Grid>
                            <Grid container className={classes.content} spacing={2} alignItems="center">
                                <Grid item>
                                    <Button size="small" variant="contained" color="primary" onClick={queryURI}
                                            disabled={calling}>
                                        Query URI
                                    </Button>
                                </Grid>

                                <Grid item>
                                    {uriCalling && (
                                        <CircularProgress size={15}/>
                                    )}
                                    {uriState && !uriCalling && (
                                        <Box fontWeight="fontWeightBold" fontSize={14} color="green">
                                            <a href={uri} target="_blank" rel="noreferrer"> {uri} </a>
                                        </Box>

                                    )}
                                    {!uriState && !uriCalling && (
                                        <Box fontWeight="fontWeightBold" fontSize={14} color="red">
                                            {uriError}
                                        </Box>
                                    )}
                                </Grid>
                            </Grid>
                            {qImage && uri && (
                                <Grid container className={classes.content} spacing={2} alignItems="center" xs={3}>
                                    <CardMedia component='img' image={`${qImage}`}/>
                                </Grid>
                            )}
                        </Container>
                    </div>
                }
            </main>
            {/* Footer */}
            <footer className={classes.footer}>
                <Copyright />
            </footer>
            {/* End footer */}
        </React.Fragment>
    );
}
