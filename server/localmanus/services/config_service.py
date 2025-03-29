import os
import toml

class ConfigService:
    def __init__(self):
        self.root_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
        self.config_file = os.path.join(self.root_dir, "openmanus", "config", "config.toml")

    async def exists_config(self):
        return os.path.exists(self.config_file)

    async def get_config(self):
        try:
            with open(self.config_file, 'r') as f:
                config = toml.load(f)
            
            # Mask API keys
            if 'llm' in config and 'api_key' in config['llm']:
                config['llm']['api_key'] = '********'
            if 'llm.vision' in config and 'api_key' in config['llm.vision']:
                config['llm.vision']['api_key'] = '********'
            
            return {"status": "success", "config": config}
        except Exception as e:
            return {"status": "error", "message": str(e)}

    async def update_config(self, data):
        try:
            with open(self.config_file, 'r') as f:
                config = toml.load(f)
            
            if 'llm' in data:
                llm_config = data['llm']
                for key in ['model', 'base_url', 'api_key', 'max_tokens', 'temperature']:
                    if key in llm_config:
                        config['llm'][key] = llm_config[key]
                        if 'llm.vision' not in config:
                            config['llm.vision'] = {}
                        config['llm.vision'][key] = llm_config[key]
            
            with open(self.config_file, 'w') as f:
                toml.dump(config, f)
            
            return {"status": "success", "message": "Configuration updated successfully"}
        except Exception as e:
            return {"status": "error", "message": str(e)} 